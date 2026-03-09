const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const regex = /function renderCarousel12\(\) \{[\s\S]*?function iniciarAutoSlider12\(totalPets\) \{[\s\S]*?\}/;
const match = code.match(regex);
if (match) {
  console.log('Found functions!');
  // create dummy environment
  try {
    global.document = {
      getElementById: (id) => {
        if(id === 'slider-12-track') return global.mockTrack;
        return null; // For others
      },
      addEventListener: () => {}
    };
    global.window = { innerWidth: 1024 };
    global.mockTrack = { innerHTML: '', style: {} };
    global.localStorage = { getItem:()=>null, setItem:()=>{} };
    
    // mock dependencies
    global.animaisPublicosDisponiveis = () => [{id: '1', nome: 'Bidu', descricao: 'A', porte: 'Médio', especie: 'cão'}];
    global.fotoPerfilDoPet = () => 'foto.jpg';
    global.estiloFotoPerfil = () => ({filter:'', transform:'', objectPosition:''});
    global.linkAdocao = () => 'link.html';
    
    eval(match[0]);
    renderCarousel12();
    console.log('Result HTML length:', global.mockTrack.innerHTML.length);
    console.log('Result HTML:', global.mockTrack.innerHTML.substring(0, 100));
  } catch(e) {
    console.log('Error evaluating:', e);
  }
} else {
  console.log('Could not find renderCarousel12');
}

