const JAMENDO_CLIENT_ID='d417490e';
const API='https://api.jamendo.com/v3.0';
const searchForm=document.querySelector('#searchForm');
const searchInput=document.querySelector('#searchInput');
const trackGrid=document.querySelector('#trackGrid');
const loadingState=document.querySelector('#loadingState');
const errorState=document.querySelector('#errorState');
const resultCount=document.querySelector('#resultCount');
const catalogTitle=document.querySelector('#catalogTitle');
const historyList=document.querySelector('#historyList');
const emptyState=document.querySelector('#emptyState');
const clearHistory=document.querySelector('#clearHistory');
const toast=document.querySelector('#toast');
const player=document.querySelector('#player');
const audioPlayer=document.querySelector('#audioPlayer');
const storageKey='baixacom_history';
let history=JSON.parse(localStorage.getItem(storageKey)||'[]');
let tracks=[];

function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2800)}
function escapeText(value){const node=document.createElement('span');node.textContent=value??'';return node.innerHTML}
function formatDuration(seconds){const min=Math.floor(seconds/60);const sec=String(seconds%60).padStart(2,'0');return min+':'+sec}
function renderHistory(){
  emptyState.hidden=history.length>0;historyList.innerHTML='';
  history.forEach(item=>{
    const row=document.createElement('article');row.className='history-item';
    row.innerHTML='<img class="history-cover" alt=""><div class="track-meta"><strong></strong><span></span></div><span class="status-badge">Baixado</span>';
    row.querySelector('img').src=item.image;row.querySelector('img').alt='Capa de '+item.name;
    row.querySelector('strong').textContent=item.name;
    row.querySelector('.track-meta span').textContent=item.artist+' · '+item.date;
    historyList.appendChild(row);
  });
}
function renderTracks(){
  trackGrid.innerHTML='';resultCount.textContent=tracks.length+' faixas';
  tracks.forEach(track=>{
    const card=document.createElement('article');card.className='music-card';
    const allowed=track.audiodownload_allowed===true;
    card.innerHTML='<button class="cover-button" aria-label="Reproduzir"><img alt=""><span class="play-icon">▶</span></button><div class="music-info"><strong></strong><span></span><small></small></div><div class="music-actions"><button class="listen-button">Ouvir</button><a class="download-button"></a></div>';
    const image=card.querySelector('img');image.src=track.album_image||track.image;image.alt='Capa de '+track.name;
    card.querySelector('.music-info strong').textContent=track.name;
    card.querySelector('.music-info span').textContent=track.artist_name;
    card.querySelector('.music-info small').textContent=formatDuration(Number(track.duration))+' · '+(track.license_ccurl?'Creative Commons':'Licença Jamendo');
    const play=()=>openPlayer(track);
    card.querySelector('.cover-button').addEventListener('click',play);
    card.querySelector('.listen-button').addEventListener('click',play);
    const link=card.querySelector('.download-button');
    if(allowed){
      link.textContent='Baixar MP3';link.href=API+'/tracks/file/?client_id='+encodeURIComponent(JAMENDO_CLIENT_ID)+'&id='+encodeURIComponent(track.id)+'&audioformat=mp32&action=download';
      link.addEventListener('click',()=>saveDownload(track));
    }else{link.textContent='Não liberado';link.classList.add('disabled');link.removeAttribute('href');}
    trackGrid.appendChild(card);
  });
}
function openPlayer(track){
  document.querySelector('#playerCover').src=track.album_image||track.image;
  document.querySelector('#playerTitle').textContent=track.name;
  document.querySelector('#playerArtist').textContent=track.artist_name;
  audioPlayer.src=track.audio;player.hidden=false;audioPlayer.play().catch(()=>notify('Clique em reproduzir para ouvir.'));
}
function saveDownload(track){
  history.unshift({name:track.name,artist:track.artist_name,image:track.album_image||track.image,date:new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date())});
  history=history.slice(0,8);localStorage.setItem(storageKey,JSON.stringify(history));renderHistory();notify('Download autorizado iniciado.');
}
async function loadTracks(query=''){
  loadingState.hidden=false;errorState.hidden=true;trackGrid.innerHTML='';resultCount.textContent='';
  const params=new URLSearchParams({client_id:JAMENDO_CLIENT_ID,format:'json',limit:'12',include:'musicinfo',audioformat:'mp32',order:query?'relevance':'popularity_week'});
  if(query)params.set('search',query);else params.set('featured','1');
  try{
    const response=await fetch(API+'/tracks/?'+params);
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();
    if(data.headers?.status!=='success')throw new Error(data.headers?.error_message||'Erro da API');
    tracks=data.results||[];renderTracks();
    if(!tracks.length){errorState.hidden=false;errorState.querySelector('h3').textContent='Nenhuma música encontrada';errorState.querySelector('p').textContent='Tente outro artista, música ou gênero.'}
  }catch(error){console.error(error);errorState.hidden=false;resultCount.textContent='';}
  finally{loadingState.hidden=true;}
}
searchForm.addEventListener('submit',event=>{event.preventDefault();const query=searchInput.value.trim();if(!query)return;catalogTitle.textContent='Resultados para “'+query+'”';loadTracks(query);document.querySelector('#catalogSection').scrollIntoView({behavior:'smooth'})});
document.querySelector('#closePlayer').addEventListener('click',()=>{audioPlayer.pause();player.hidden=true});
clearHistory.addEventListener('click',()=>{history=[];localStorage.removeItem(storageKey);renderHistory();notify('Histórico removido.')});
document.querySelector('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('baixacom_theme',document.body.classList.contains('light')?'light':'dark')});
if(localStorage.getItem('baixacom_theme')==='light')document.body.classList.add('light');
renderHistory();loadTracks();