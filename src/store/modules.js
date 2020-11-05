import { createNamespacedHelpers } from 'vuex'

const dashboard = createNamespacedHelpers('dashboard')
const entities = createNamespacedHelpers('dashboard/entities')

export { entities, dashboard }

export default { entities, dashboard }
