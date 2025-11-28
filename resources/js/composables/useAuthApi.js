import {useApi} from '@/composables/useApi.js'
import {axiosPlain} from "@/libs/axiosPlain.js";

export function useAuthApi() {
    const {get, post, patch, del} = useApi()

    const csrf = () => axiosPlain.get('/sanctum/csrf-cookie')
    const login = (data) => post('/login', data)
    const register = (data) => post('/register', data)
    const logout = () => post('/logout')
    const getUser = () => get('/user')
    const updateUser = (id, data) => patch(`/users/${id}`, data)
    const removeUser = (id) => del(`users/${id}`)

    return {
        csrf,
        login,
        register,
        logout,
        getUser,
        updateUser,
        removeUser
    }
}
