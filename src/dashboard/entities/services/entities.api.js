import axios from 'axios'

const api = {
  getAll: async () => {
    return await axios.get('http://localhost:8090/index.php').then((response) => {
      return response.data
    }).catch(error => {
      throw new Error(error)
    })
  },
}
export { api }

export default { api }
