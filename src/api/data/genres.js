import api from '../auth/interceptors'

const findGenreByName = async (name) => {
  const result = await api.get('/genres/search', {
    params: { name },
  })
  return result.data
}
const findGenreById = async (id) => {
  const result = await api.get(`/genres/${id}`)
  return result.data
}


const createGenre = async (data) => {
  const result = await api.post('/genres', data)
  return result.data
}

const updateGenreById = async (id, data) => {
  const result = await api.patch(`/genres/${id}`, data)
  return result.data
}

const deleteGenreById = async (id) => {
  const result = await api.delete(`/genres/${id}`)
  return result.data
}

const findAllGenres = async () => {
  const result = await api.get('/genres')
  return result.data
}

const handleExportGenresToCSV = async () => {
  const result = await api.get('/genres', {
    params: { export: true }, // 💡 التصحيح: وضعها داخل كائن الـ params
    responseType: 'blob'     // 💡 أساسي لكي يستقبل المتصفح الملف بشكل سليم
  })

  return result.data
}


export {
  findGenreByName,
  findAllGenres,
  createGenre,
  findGenreById,
  updateGenreById,
  deleteGenreById,
  handleExportGenresToCSV
}
