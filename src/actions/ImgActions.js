import { toJson } from 'unsplash-js'

import { unsplash } from './UserActions'

export const GET_IMAGE_REQUEST = 'GET_IMAGE_REQUEST'
export const GET_IMAGE_SUCCESS = 'GET_IMAGE_SUCCESS'
export const GET_IMAGE_FAIL = 'GET_IMAGE_FAIL'

export const SHOW_LIST_IMG = 'SHOW_LIST_IMG'

export const GET_LIKE_REQUEST = 'GET_LIKE_REQUEST'
export const GET_LIKE_SUCCESS = 'GET_LIKE_SUCCESS'
export const GET_LIKE_FAIL = 'GET_LIKE_FAIL'

export const OPEN_MODAL = 'OPEN_MODAL'

export const GET_DL_IMG_REQUEST = 'GET_DL_IMG_REQUEST'
export const GET_DL_IMG_SUCCESS = 'GET_DL_IMG_SUCCESS'
export const GET_DL_IMG_FAIL = 'GET_DL_IMG_FAIL'

let pageImg = 0 // Страница загрузки изображений с сервера unsplash
let quantLoadImg = 30 // Кол-во загружаемых изображений с сервера Unsplash
let localId = 0 // Внутренний ID (ссылка) изображения

function transformDate(date) {
  let newDate = new Date(date)
  return newDate.toLocaleString('ru')
}
// Загрузка и отображение фото
export function getImages(quantImg = 0) {
  return (dispatch) => {
    // Для уменьшения нагрузки на сервер делаем максимальную загрузку данных с сервера (30 фото)
    if (quantImg === quantLoadImg * pageImg) {
      // Проверяем показаны ли все ранее кэширов. данные
      // Асинхронный код загрузки с unsplash
      pageImg = ++pageImg // Меняем номер страницы загрузки изображений
      dispatch({
        type: GET_IMAGE_REQUEST,
      })

      unsplash.photos
        .listPhotos(pageImg, quantLoadImg) // Получаем изображения
        .then(toJson)
        .then((json) => {
          // Добавлеяем локальный формат времени и внутрений id изображенний в наш массив
          const newJson = json.map((item) => ({
            ...item,
            local_date: transformDate(item.created_at),
            local_id: localId++,
          }))
          dispatch({
            type: GET_IMAGE_SUCCESS,
            payload: newJson,
          })
          dispatch({
            // Показываем первые десять фото
            type: SHOW_LIST_IMG,
          })
        })
        .catch((e) => {
          console.log('Ошибка загрузка списка - ' + e)
          dispatch({
            type: GET_IMAGE_FAIL,
            error: true,
            payload: new Error(e),
          })
        })
    } else {
      // Показываем кэшированные фотографии
      dispatch({
        type: SHOW_LIST_IMG,
      })
    }
  }
}
// Обработка лайков
export function getLikeImg(img) {
  return (dispatch) => {
    const statusUserLike = img.liked_by_user
    dispatch({
      type: GET_LIKE_REQUEST,
      payload: img,
    })
    try {
      // Проверяем был ли ранее лайк
      if (!statusUserLike) {
        unsplash.photos
          .likePhoto(img.id)
          .then(toJson)
          .then((json) => {
            dispatch({
              type: GET_LIKE_SUCCESS,
              payload: {
                ...json.photo,
                user: img.user,
                local_date: img.local_date,
                local_id: img.local_id,
              },
            })
          })
      } else {
        unsplash.photos
          .unlikePhoto(img.id)
          .then(toJson)
          .then((json) => {
            dispatch({
              type: GET_LIKE_SUCCESS,
              payload: {
                ...json.photo,
                user: img.user,
                local_date: img.local_date,
                local_id: img.local_id,
              },
            })
          })
      }
    } catch (e) {
      console.log('Ошибка лайка - ' + e)
      dispatch({
        type: GET_LIKE_FAIL,
        error: true,
        payload: new Error(e),
        img: img,
      })
    }
  }
}
// Открычтие/закрытие модального окна
export function openModal(img, statusDL = false) {
  return (dispatch) => {
    dispatch({
      type: OPEN_MODAL,
      modal_img: img,
      statusDL: statusDL,
    })
  }
}
// Открытие фото по прямой ссылке
export function getDirectLinkImg(id) {
  return (dispatch) => {
    dispatch({
      type: GET_DL_IMG_REQUEST,
    })
    unsplash.photos
      .getPhoto(id)
      .then(toJson)
      .then((json) => {
        console.log(json)
        dispatch({
          type: GET_DL_IMG_SUCCESS,
          payload: { ...json, local_date: transformDate(json.created_at) },
        })
      })
      .catch((e) => {
        console.log('Ошибка загрузка картинки - ' + e)
        dispatch({
          type: GET_DL_IMG_FAIL,
          error: true,
          payload: new Error(e),
        })
      })
  }
}
