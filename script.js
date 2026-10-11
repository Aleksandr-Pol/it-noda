document.getElementById('y').textContent=new Date().getFullYear();
const form=document.getElementById('lead');
const rules={
  name:v=>v.trim().length>=2||'Укажите имя',
  contact:v=>/^(\+?[\d\s()-]{7,}|[^\s@]+@[^\s@]+\.[^\s@]+|@?[A-Za-z0-9_]{4,})$/.test(v.trim())||'Укажите телефон, email или Telegram',
  type:v=>!!v||'Выберите тип проекта',
  desc:v=>v.trim().length>=10||'Опишите задачу (минимум 10 символов)'
};
function check(el){const r=rules[el.name];if(!r)return true;const res=r(el.value);const l=el.closest('label');
  l.classList.toggle('err',res!==true);l.querySelector('small').textContent=res===true?'':res;return res===true;}
form.addEventListener('input',e=>{if(e.target.closest('.err'))check(e.target)});
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const ok=[...form.elements].filter(el=>rules[el.name]).map(check).every(Boolean);
  if(!ok)return;
  const btn=form.querySelector('button[type=submit]'),errBox=document.getElementById('formError');
  if(form._honey.value)return; // бот заполнил скрытое поле
  const f=new FormData(form);
  const data={
    'Имя':f.get('name'),'Контакт':f.get('contact'),'Тип проекта':f.get('type'),
    'Описание':f.get('desc'),'Бюджет':f.get('budget')||'не указан',
    _subject:'Новая заявка с сайта it-noda',_template:'table',_captcha:'false',_honey:''
  };
  errBox.hidden=true;btn.disabled=true;btn.textContent='Отправка…';
  try{
    // FormSubmit: при первой отправке на адрес придёт письмо активации, его нужно подтвердить
    const r=await fetch('https://formsubmit.co/ajax/aleksandr161@mail.ru',{method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||j.success===false||j.success==='false')throw new Error(j.message||r.status);
    form.hidden=true;document.getElementById('success').hidden=false;
  }catch(err){
    console.error(err);
    errBox.textContent='Не удалось отправить заявку. Попробуйте ещё раз чуть позже или свяжитесь со мной напрямую.';
    errBox.hidden=false;
  }finally{btn.disabled=false;btn.textContent='Отправить заявку';}
});
