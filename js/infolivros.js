import { supabase } from './supabase.js'

// iniciar modal
export async function iniciarInfoLivro(id) {

  const modal = document.getElementById('modalInfoLivro')

  // fechar
  document.getElementById('fecharInfoLivro')?.addEventListener('click', () => {
    modal.classList.add('hidden')
  })
  document.getElementById('btnFecharInfoLivro')?.addEventListener('click', () => {
    modal.classList.add('hidden')
  })

  // avaliar
  document.getElementById('btnAvaliarLivro')?.addEventListener('click', () => {
    window.location.href = '../perfil.html'
  })

  // carregar infos
  const { data, error } = await supabase
    .from('livros')
    .select('id, titulo, autor, capa, editora, lancamento, descricao')
    .eq('id', id)
    .single()

  if (error || !data) return

  // capa
  const capaImg = document.getElementById('infoCapa')
  const capaPlaceholder = document.getElementById('infoCapaPlaceholder')

  if (data.capa) {
    capaImg.src = data.capa
    capaImg.classList.remove('hidden')
    capaPlaceholder.classList.add('hidden')
  }

  // titulo
  document.getElementById('infoTitulo').textContent = data.titulo || ''

  // autor
  document.getElementById('infoAutor').textContent = data.autor || ''

  // editora
  document.getElementById('infoEditora').textContent = data.editora || '-'

  // lançamento
  document.getElementById('infoLancamento').textContent =
    data.lancamento ? new Date(data.lancamento).toLocaleDateString('pt-BR') : '-'

  // descrição
  document.getElementById('infoDescricao').innerHTML = data.descricao || ''
}
