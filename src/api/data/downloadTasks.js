import api from '@/api/auth/interceptors'

const createTask = async (data = {}) => {
  const result = await api.post('/tasks', data)
  return result.data
}

const updateTaskById = async (id, data) => {
  const result = await api.patch(`/tasks/${id}`, data)
  return result.data
}

const getAllTasks = async ({ order = 'DESC', page = 1, limit = 20, search } = {}) => {
  const result = await api.get('/tasks', {
    params: {
      ...(order && { order }),
      page,
      limit,
      ...(search && { search }),
    },
  })

  return result.data
}

const findByTaskId = async (id) => {
  const result = await api.get(`/tasks/${id}`)
  return result.data
}

const findByTaskByName = async ({ taskName, page = 1, limit = 20 } = {}) => {
  const result = await api.get('/tasks/by-name', {
    params: {
      taskName,
      page,
      limit,
    },
  })

  return result.data
}

const deleteTaskById = async (id) => {
  const result = await api.delete(`/tasks/${id}`)
  return result.data
}

export { createTask, updateTaskById, getAllTasks, findByTaskId, findByTaskByName, deleteTaskById }
