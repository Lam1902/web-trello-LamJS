import axios from "axios";
import { API_ROOT } from "~/utils/constants";



// board
export const fetchBoardDetails_API = async (boardId) => {
    const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // console.log('kq: ', res.data)
    return res.data
}

export const updateBoard_API = async (boardId, data) => {
    const res = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, data)
    // console.log('kq: ', res.data)
    return res.data
}

export const moveCardToDifferentColumn_API = async (data) => {
    const res = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, data)
    // console.log('kq: ', res.data)
    return res.data
}


//column
export const createNewColumn_API = async (columnData) => {
    const res = await axios.post(`${API_ROOT}/v1/columns`, columnData)
    // console.log('kq: ', res.data)
    return res.data
}

export const updateColumn_API = async (columnId, data) => {
    const res = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, data)
    // console.log('kq: ', res.data)
    return res.data
}

export const deleteColumn_API = async (columnId) => {
    const res = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
    // console.log('kq: ', res.data)
    return res.data
}


//card
export const createNewCard_API = async (cardData) => {
    const res = await axios.post(`${API_ROOT}/v1/cards`, cardData)
    // console.log('kq: ', res.data)
    return res.data
}