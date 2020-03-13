import axios from 'axios'

const baseURL = 'http://localhost:3003/api/todos'

export const changeDescription = event => ({
    type: 'DESCRIPTION_CHANGED',
    payload: event.target.value
})

export const search = (description) => {
    return (dispatch, getState) => {
        const description = getState().todo.description
        const search = description ? `&description__regex=/${description}/` : ''
        const request = axios.get(`${baseURL}?sort=-createdAt${search}`)
            .then( resp => dispatch({ type: 'TODO_SEARCHED', payload: resp.data }) )
    }
}

export const add = (description) => {
    return dispatch => {
        axios.post(baseURL, { description })
            .then( resp => dispatch(clear()) )
            .then( resp => dispatch(search()) )
    } 
}

export const remove = (todo) => {
    return dispatch => {
        axios.delete(`${baseURL}/${todo._id}`)
            .then( resp => dispatch({ type: 'TODO_DELETED' }) )
            .then( resp => dispatch(search()))
    }
}

export const markAsDone = (todo) => {
    return dispatch => {
        axios.put(`${baseURL}/${todo._id}`, { ...todo, done: true })
            .then( resp => dispatch({ type: 'TODO_MARKED_AS_DONE', payload: resp.data}) )
            .then( resp => dispatch(search()) )
    }
}

export const markAsPending = (todo) => {
    return dispatch => {
        axios.put(`${baseURL}/${todo._id}`, { ...todo, done: false })
            .then( resp => dispatch({ type: 'TODO_MARKED_AS_PENDING', payload: resp.data}) )
            .then( resp => dispatch(search()) )
    }
}

export const clear = () => {
    return [{ type: 'TODO_CLEAR' }, search()]
}