const form=document.querySelector('#downloadForm');
const urlInput=document.querySelector('#audioUrl');
const pasteButton=document.querySelector('#pasteButton');
const statusPanel=document.querySelector('#statusPanel');
const statusText=document.querySelector('#statusText');
const statusPercent=document.querySelector('#statusPercent');
const progressBar=document.querySelector('#progressBar');
const historyList=document.querySelector('#historyList');
const emptyState=document.querySelector('#emptyState');
const clearHistory=document.querySelector('#clearHistory');
const submitButton=form.querySelector('button[type="submit"]');
const toast=document.querySelector('#toast');
const storageKey='baixacom_history';
let history=JSON.parse(localStorage.getItem(storageKey)||'[]');

function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500)}
function safeHost(value){try{return new URL(value).hostname.replace(/^www\./,'')}catch{return 'Áudio'}}
function renderHistory(){
  emptyState.hidden=history.length>0;historyList.innerHTML='';
  history.forEach(item=>{
    const row=document.createElement('article');row.className='history-item';
    row.innerHTML='<span class="track-icon"><svg viewBox="0 0 24 24"><path d="M9 18V5l10-2v13M9 9l10-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg></span><div class="track-meta"><strong></strong><span></span></div><span class="status-badge">Preparado</span>';
    row.querySelector('strong').textContent=item.name;
    row.querySelector('.track-meta span').textContent=item.format+' · '+item.quality+' · '+item.date;
    historyList.appendChild(row);
  });
}
pasteButton.addEventListener('click',async()=>{
  try{urlInput.value=await navigator.clipboard.readText();urlInput.focus()}
  catch{notify('Permita o acesso à área de transferência.')}
});
form.addEventListener('submit',event=>{
  event.preventDefault();
  let parsed;try{parsed=new URL(urlInput.value);if(!/^https?:$/.test(parsed.protocol))throw new Error()}
  catch{notify('Insira um link válido começando com http ou https.');urlInput.focus();return}
  statusPanel.hidden=false;submitButton.disabled=true;
  let progress=0;const stages=[['Analisando o link…',28],['Verificando o áudio…',58],['Preparando o arquivo…',86],['Pronto para integrar à API',100]];
  const timer=setInterval(()=>{
    progress=Math.min(progress+4,100);
    const stage=stages.find(([,limit])=>progress<=limit)||stages[3];
    statusText.textContent=stage[0];statusPercent.textContent=progress+'%';progressBar.style.width=progress+'%';
    if(progress===100){
      clearInterval(timer);submitButton.disabled=false;
      history.unshift({name:safeHost(urlInput.value),format:document.querySelector('#format').value,quality:document.querySelector('#quality').value,date:new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date())});
      history=history.slice(0,6);localStorage.setItem(storageKey,JSON.stringify(history));renderHistory();
      notify('Link preparado. Conecte uma API autorizada para baixar.');urlInput.value='';
    }
  },70);
});
clearHistory.addEventListener('click',()=>{history=[];localStorage.removeItem(storageKey);renderHistory();notify('Histórico removido.')});
document.querySelector('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('baixacom_theme',document.body.classList.contains('light')?'light':'dark')});
if(localStorage.getItem('baixacom_theme')==='light')document.body.classList.add('light');
renderHistory();