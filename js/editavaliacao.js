import { supabase } from './supabase.js'

let quill
let avaliacaoId = null
let notaSelecionada = 0

// -------------------------------------------------------------
// INICIALIZAR MODAL
// -------------------------------------------------------------
export async function iniciarEditarAvaliacao(id) {
  avaliacaoId = id

  // Configura o Quill
  quill = new Quill('#editor-edit', {
    theme: 'snow',
    placeholder: 'Edite sua avaliação...',
  })

  // Carrega dados da avaliação
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('nota, descricao, livros(id, titulo, capa)')
    .eq('id', id)
    .single()

  if (error) return console.error(error)

  // Preenche visual
  document.getElementById('capaLivroEdit').src = data.livros.capa
  document.getElementById('tituloLivroEdit').textContent = data.livros.titulo

  quill.root.innerHTML = data.descricao
  notaSelecionada = data.nota

  // Marcar estrelas
  marcarEstrelas()

  // Eventos de estrela
  document.querySelectorAll('#estrelas-edit span').forEach(s => {
    s.addEventListener('click', () => {
      notaSelecionada = Number(s.dataset.valor)
      marcarEstrelas()
    })
  })

  // Botão salvar
  document.getElementById('salvarEditBtn').onclick = salvarEdicao

  // Botão fechar
  document.getElementById('fecharEditarAvaliacao').onclick = () => {
    document.getElementById('modalEditarAvaliacao').classList.add('hidden')
  }
}

// -------------------------------------------------------------
// MARCAR ESTRELAS
// -------------------------------------------------------------
function marcarEstrelas() {
  document.querySelectorAll('#estrelas-edit span').forEach(s => {
    const val = Number(s.dataset.valor)
    if (val <= notaSelecionada) {
      s.classList.add('text-yellow-400')
      s.classList.remove('text-gray-300')
    } else {
      s.classList.add('text-gray-300')
      s.classList.remove('text-yellow-400')
    }
  })
}

// -------------------------------------------------------------
// SALVAR EDIÇÃO
// -------------------------------------------------------------
async function salvarEdicao() {
  const descricao = quill.root.innerHTML.trim()

  const { error } = await supabase
    .from('avaliacoes')
    .update({
      nota: notaSelecionada,
      descricao: descricao,
      data: new Date()
    })
    .eq('id', avaliacaoId)

  if (error) {
    toast('Erro ao salvar edição.')
  } else {
    toast('Avaliação atualizada.')
    document.getElementById('modalEditarAvaliacao').classList.add('hidden')

    // Atualiza lista do perfil
    if (window.carregarAvaliacoes) {
      carregarAvaliacoes()
    }
  }
}
