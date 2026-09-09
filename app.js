const WHATSAPP='5567971623890';
const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
const snacks=[
  ['x-tanto-faz','X-Tanto Faz Montado no Prato',48,'Pão de hambúrguer, alface, tomate, batata palha, milho, hambúrguer, presunto, mussarela, salsicha, ovo, filé mignon, filé de frango, calabresa, bacon, cheddar e catupiry'],
  ['misto','Misto',10,'Pão de hambúrguer, 2 presuntos, 2 mussarelas e catupiry'],
  ['x-burguer','X-Burguer',18,'Pão de hambúrguer, presunto, mussarela, hambúrguer e catupiry'],
  ['x-pantaneira','X-Pantaneira',32,'Pão de hambúrguer ou francês, mussarela, alface, tomate, banana-prata, bacon, carne-seca e catupiry'],
  ['x-duplo-rancho','X-Duplo Rancho',40,'Pão de hambúrguer, alface, tomate, batata palha, milho, 2 hambúrgueres, 2 presuntos, 2 mussarelas, 2 salsichas, 2 ovos, catupiry e cheddar'],
  ['x-frango','X-Frango',28,'Pão de hambúrguer ou francês, alface, tomate, batata palha, milho, filé de frango, presunto, mussarela, bacon, cheddar e catupiry'],
  ['x-rancho','X-Rancho',40,'Pão de hambúrguer, alface, 2 hambúrgueres, tomate, batata palha, milho, calabresa, bacon, presunto, mussarela, salsicha, ovo, catupiry e cheddar'],
  ['x-bacon','X-Bacon',24,'Pão de hambúrguer, alface, tomate, hambúrguer, presunto, mussarela, bacon e cheddar'],
  ['x-salada','X-Salada',20,'Pão de hambúrguer, alface, tomate, hambúrguer, presunto, mussarela e catupiry'],
  ['x-tudo','X-Tudo',30,'Pão de hambúrguer, alface, hambúrguer, tomate, batata palha, milho, calabresa, bacon, presunto, mussarela, salsicha, ovo e catupiry'],
  ['x-calabresa','X-Calabresa',24,'Pão de hambúrguer, alface, tomate, hambúrguer, presunto, mussarela, calabresa e catupiry'],
  ['x-eggs','X-Eggs',22,'Pão de hambúrguer, alface, tomate, hambúrguer, presunto, mussarela, 2 ovos e catupiry'],
  ['x-acebolado','X-Acebolado',30,'Pão de hambúrguer ou francês, alface, tomate, azeitona, filé mignon, presunto, mussarela, batata, milho, cebola e catupiry'],
  ['x-americano','X-Americano',24,'Pão de hambúrguer, alface, tomate, hambúrguer, presunto, mussarela, ovo, bacon, cheddar ou catupiry'],
  ['cachorro-quente','Cachorro Quente Prensado',14,'Pão de hambúrguer, presunto, mussarela, salsicha, batata palha, milho e catupiry'],
  ['x-file-mignon','X-Filé Mignon',30,'Pão de hambúrguer ou francês, presunto, mussarela, filé mignon, batata palha, milho e catupiry']
].map(([id,name,price,description])=>({id,name,price,description,category:'lanches'}));
const pizzas=[
  ['banana-canela','Banana com Canela',50,60,'Massa, creme de leite, leite condensado, mussarela, banana e chocolate branco'],
  ['prestigio','Prestígio',50,60,'Massa, creme de leite, mussarela, chocolate branco, coco ralado, chocolate e cereja'],
  ['chocolate','Chocolate',50,60,'Massa, creme de leite, mussarela, chocolate e morango'],
  ['romeu-julieta','Romeu e Julieta',40,50,'Massa, creme de leite, mussarela e goiabada']
].map(([id,name,medium,large,description])=>({id,name,price:medium,description,category:'pizzas',sizes:[{name:'Média',price:medium},{name:'Grande',price:large}]}));
const products=[...snacks,...pizzas];
const snackExtras=[['Hambúrguer',6],['Filé mignon',6],['Filé de frango',6],['Calabresa',6],['Bacon',6],['Ovo',3],['Presunto',3],['Mussarela',3],['Tomate e alface',3],['Salsicha',3],['Banana-da-terra',3],['Molho verde',1],['Cheddar ou catupiry',1]];
const pizzaExtras=[['Morango',12],['Chocolate',12],['Chocolate branco',12],['Banana',12],['Mussarela',12]];
let cart=[];let current=null;let selectedSize=0;let selectedExtras=[];
const $=selector=>document.querySelector(selector);

function renderMenu(filter='todos'){
  const list=filter==='todos'?products:products.filter(p=>p.category===filter);
  $('#itemCount').textContent=list.length;
  $('#menuGrid').innerHTML=list.map(p=>`<article class="menu-card" data-category="${p.category}"><span class="type">${p.category==='lanches'?'Lanche':'Pizza doce'}</span><h3>${p.name}</h3><p>${p.description}</p><div class="card-bottom"><div class="price"><small>${p.sizes?'A partir de':'Preço'}</small><strong>${money(p.price)}</strong></div><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name}">+</button></div></article>`).join('');
}
function openOptions(product){
  current=product;selectedSize=0;selectedExtras=[];
  $('#modalTitle').textContent=product.name;$('#modalDescription').textContent=product.description;
  const sizes=product.sizes||[{name:'Único',price:product.price}];
  $('#sizeOptions').innerHTML=sizes.map((s,i)=>`<button class="option-button ${i===0?'selected':''}" data-size="${i}"><span>Tamanho</span><strong>${s.name} · ${money(s.price)}</strong></button>`).join('');
  const extras=product.category==='pizzas'?pizzaExtras:snackExtras;
  $('#extraOptions').innerHTML=extras.map((e,i)=>`<label class="extra"><input type="checkbox" data-extra="${i}"><b>${e[0]}</b><span>+ ${money(e[1])}</span></label>`).join('');
  updateModalTotal();$('#optionModal').hidden=false;document.body.style.overflow='hidden';
}
function updateModalTotal(){const base=(current.sizes||[{price:current.price}])[selectedSize].price;$('#modalTotal').textContent=money(base+selectedExtras.reduce((sum,e)=>sum+e[1],0))}
function closeModal(){$('#optionModal').hidden=true;document.body.style.overflow=''}
function addToCart(){
  const size=(current.sizes||[{name:'Único',price:current.price}])[selectedSize];
  const unit=size.price+selectedExtras.reduce((sum,e)=>sum+e[1],0);
  const signature=current.id+'-'+size.name+'-'+selectedExtras.map(e=>e[0]).sort().join('|');
  const found=cart.find(i=>i.signature===signature);
  if(found)found.qty++;else cart.push({signature,id:current.id,name:current.name,size:size.name,extras:[...selectedExtras],unit,qty:1});
  closeModal();renderCart();notify(current.name+' adicionado!');
}
function renderCart(){
  const qty=cart.reduce((s,i)=>s+i.qty,0),total=cart.reduce((s,i)=>s+i.unit*i.qty,0);
  $('#cartCount').textContent=qty;$('#mobileCartCount').textContent=qty;$('#cartEmpty').hidden=qty>0;$('#cartSummary').hidden=qty===0;$('#mobileCart').hidden=qty===0;
  $('#cartTotal').textContent=money(total);$('#mobileCartTotal').textContent=money(total);
  $('#cartItems').innerHTML=cart.map((i,index)=>`<article class="cart-item"><div class="cart-item-head"><div><h3>${i.name}${i.size!=='Único'?' · '+i.size:''}</h3><p>${i.extras.length?'Adicionais: '+i.extras.map(e=>e[0]).join(', '):'Sem adicionais'}</p></div><button class="remove" data-remove="${index}" aria-label="Remover">×</button></div><div class="cart-item-bottom"><div class="qty"><button data-dec="${index}">−</button><span>${i.qty}</span><button data-inc="${index}">+</button></div><strong class="item-subtotal">${money(i.unit*i.qty)}</strong></div></article>`).join('');
}
function sendOrder(){
  const name=$('#customerName').value.trim(),phone=$('#customerPhone').value.trim(),notes=$('#customerNotes').value.trim();
  if(name.length<2){$('#formError').textContent='Informe seu nome para continuar.';$('#customerName').focus();return}
  if(phone.replace(/\D/g,'').length<10){$('#formError').textContent='Informe um número de telefone válido.';$('#customerPhone').focus();return}
  $('#formError').textContent='';
  const lines=['🍔 *NOVO PEDIDO — RANCHO*','','👤 *Cliente:* '+name,'📱 *Telefone:* '+phone,'','*ITENS DO PEDIDO:*'];
  cart.forEach((i,n)=>{lines.push(`${n+1}. *${i.qty}x ${i.name}*${i.size!=='Único'?' ('+i.size+')':''}`);if(i.extras.length)lines.push('   Adicionais: '+i.extras.map(e=>e[0]).join(', '));lines.push('   Subtotal: '+money(i.unit*i.qty));});
  const total=cart.reduce((s,i)=>s+i.unit*i.qty,0);lines.push('',`💰 *TOTAL: ${money(total)}*`);if(notes)lines.push('','📝 *Observações:* '+notes);lines.push('','Pedido enviado pelo cardápio digital.');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
}
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200)}
renderMenu();
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');if(add)openOptions(products.find(p=>p.id===add.dataset.add));
  const category=e.target.closest('[data-filter]');if(category){document.querySelectorAll('.category').forEach(b=>b.classList.remove('active'));category.classList.add('active');renderMenu(category.dataset.filter)}
  const size=e.target.closest('[data-size]');if(size){selectedSize=Number(size.dataset.size);document.querySelectorAll('.option-button').forEach(b=>b.classList.remove('selected'));size.classList.add('selected');updateModalTotal()}
  if(e.target.closest('[data-close-modal]'))closeModal();
  const remove=e.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);renderCart()}
  const inc=e.target.closest('[data-inc]');if(inc){cart[Number(inc.dataset.inc)].qty++;renderCart()}
  const dec=e.target.closest('[data-dec]');if(dec){const i=Number(dec.dataset.dec);cart[i].qty--;if(cart[i].qty<1)cart.splice(i,1);renderCart()}
});
$('#extraOptions').addEventListener('change',e=>{if(!e.target.matches('[data-extra]'))return;const extras=current.category==='pizzas'?pizzaExtras:snackExtras,item=extras[Number(e.target.dataset.extra)];selectedExtras=e.target.checked?[...selectedExtras,item]:selectedExtras.filter(x=>x[0]!==item[0]);updateModalTotal()});
$('#confirmAdd').addEventListener('click',addToCart);$('#sendOrder').addEventListener('click',sendOrder);$('#mobileCart').addEventListener('click',()=>$('#cart').scrollIntoView({behavior:'smooth',block:'start'}));
$('#customerPhone').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,11);if(v.length>6)v=`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;else if(v.length>2)v=`(${v.slice(0,2)}) ${v.slice(2)}`;else if(v)v=`(${v}`;e.target.value=v});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#optionModal').hidden)closeModal()});
