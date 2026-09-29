import supabase from './supabase'

export const supabaseApi = {
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch {
      return null
    }
  },
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  register: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: userData.full_name, company: userData.company || '' } }
      })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  logout: async () => {
    await supabase.auth.signOut()
    return { success: true }
  },
  getVehicles: async () => {
    const { data, error } = await supabase.from('vehicles').select('*')
    if (error) throw error
    return data
  },
  addVehicle: async (vehicle) => {
    const { data, error } = await supabase.from('vehicles').insert([vehicle]).select()
    if (error) throw error
    return data[0]
  },
  deleteVehicle: async (id) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) throw error
    return true
  }
}

export default supabaseApi
