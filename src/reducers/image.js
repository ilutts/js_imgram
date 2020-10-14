import {
  GET_IMAGE_REQUEST,
  GET_IMAGE_SUCCESS,
  GET_IMAGE_FAIL,
  SHOW_LIST_IMG,
  GET_LIKE_REQUEST,
  GET_LIKE_SUCCESS,
  GET_LIKE_FAIL,
  OPEN_MODAL,
  GET_DL_IMG_REQUEST,
  GET_DL_IMG_SUCCESS,
  GET_DL_IMG_FAIL,
} from '../actions/ImgActions'

let quantShowImg = 0

const initialState = {
  visibleImgs: [], // Видимы фотографии
  cachedImgs: [], // Кэшированные фото
  error: '', // добавили для сохранения текста ошибки
  isFetching: false, // добавили для реакции на статус "загружаю" или нет
  modalIsOpen: false, // Статус модального окна
  modalImgId: '', // ID фото для модального окна
  directLinkImage: {}, // Картинка открытая по прямой ссылке
  followDirectLinkImg: false, // Был ли переход по прямой ссылке
}

export function imageReducer(state = initialState, action) {
  switch (action.type) {
    // Загрузка изображений
    case GET_IMAGE_REQUEST:
      return { ...state, isFetching: true, error: '' }
    case GET_IMAGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        cachedImgs: state.cachedImgs.concat(action.payload),
      }
    case GET_IMAGE_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.payload.message,
      }
    // Количество отображаемых картинок
    case SHOW_LIST_IMG:
      quantShowImg = quantShowImg + 10
      return { ...state, visibleImgs: state.cachedImgs.slice(0, quantShowImg) }
    // Обработка лайка изображения
    case GET_LIKE_REQUEST:
      // "Оптимистичный лайк - до получения данных с сервера"
      let imgLike = state.visibleImgs[action.payload.local_id]
      // Проверяем как открыто изображение (по прямой ссылке?)
      if (!imgLike) {
        imgLike = state.directLinkImage
      }
      imgLike.liked_by_user ? --imgLike.likes : ++imgLike.likes
      imgLike.liked_by_user = !imgLike.liked_by_user
      return { ...state, isFetching: true, error: '' }
    case GET_LIKE_SUCCESS:
      if (action.payload.local_id) {
        state.visibleImgs[action.payload.local_id] = action.payload
      } else {
        state.directLinkImage = action.payload
      }

      return {
        ...state,
        isFetching: false,
      }
    case GET_LIKE_FAIL:
      // Откат "Оптимистичного лайка" - при получение ошибки с сервера
      let imgLikeFail = state.visibleImgs[action.img.local_id]

      if (!imgLikeFail) {
        imgLikeFail = state.directLinkImage
      }

      imgLikeFail.liked_by_user ? ++imgLikeFail.likes : --imgLikeFail.likes
      imgLikeFail.liked_by_user = !imgLikeFail.liked_by_user

      return { ...state, isFetching: false, error: action.payload.message }
    // Открыто/закрыто модальное окно
    case OPEN_MODAL:
      return {
        ...state,
        modalIsOpen: !state.modalIsOpen,
        modalImgId: action.modal_img,
        followDirectLinkImg: action.statusDL,
      }
    // Обработка изображений при заходе по прямой ссылук
    case GET_DL_IMG_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
        followDirectLinkImg: false,
      }
    case GET_DL_IMG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        directLinkImage: action.payload,
      }
    case GET_DL_IMG_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.payload.message,
      }
    default:
      return state
  }
}
