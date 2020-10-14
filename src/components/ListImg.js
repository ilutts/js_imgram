import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import './ListImg.css'

export default function ListImg(props) {
  const {
    authorized,
    visibleImgs,
    error,
    isFetching,
    openModal,
    getLikeImg,
  } = props

  function getLikeStatus(item) {
    return item.liked_by_user ? 'btn-like' : 'btn-like btn-like--unactive'
  }

  function showImgList() {
    if (error) {
      return <p>Ошибка! {error}</p>
    }

    if (isFetching && visibleImgs.length === 0) {
      return <p>Загрузка изображения...</p>
    }

    if (visibleImgs.length === 0) {
      return <p>Изображений нет</p>
    } else {
      return (
        <ul>
          {visibleImgs.map((item, index) => (
            <li key={index}>
              <Link
                className="link-img"
                to={{
                  pathname: `img/${item.id}`,
                }}
                onClick={() => openModal(item.local_id)}
              >
                <img
                  className="list-img"
                  src={item.urls.small}
                  alt={item.alt_description}
                />
              </Link>
              <p>
                <a
                  className="link-user"
                  href={item.user.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.user.username}
                </a>
                <button
                  className={getLikeStatus(item)}
                  onClick={() => (authorized ? getLikeImg(item) : false)}
                >
                  {' '}
                  {item.likes}
                </button>
              </p>
              <p>{item.local_date}</p>
            </li>
          ))}
        </ul>
      )
    }
  }

  return <div>{showImgList()}</div>
}

ListImg.propTypes = {
  visibleImgs: PropTypes.array.isRequired,
  authorized: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
  getLikeImg: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}
