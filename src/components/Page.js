import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import ModalImg from './ModalImg'
import { useHistory } from 'react-router-dom'

const ListImg = lazy(() => import('./ListImg'))

let firstRun = true

const customStyles = {
  content: {
    padding: '10px 20px 20px',
    maxWidth: '100%',
    maxHeight: '100%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

Modal.setAppElement('#root')

export default function Page(props) {
  const {
    image,
    authorized,
    getImages,
    getLikeImg,
    openModal,
    getDirectLinkImg,
  } = props

  let history = useHistory()

  function closeModal() {
    history.action === 'PUSH' ? history.goBack() : history.push('/')
    openModal(0)
  }

  if (firstRun) {
    getImages()
    if (
      window.location.pathname !== '/' &&
      !image.modalIsOpen &&
      history.action === 'POP'
    ) {
      const idImg = window.location.pathname.split('/img/')[1]
      openModal(idImg, true)
    }
    firstRun = false
  }

  document.addEventListener('scroll', () => {
    let screenBottom =
      document.documentElement.clientHeight + window.pageYOffset
    let pageBottom = document.documentElement.scrollHeight

    if (pageBottom - screenBottom < 100 && !image.isFetching) {
      getImages(image.visibleImgs.length)
    }
  })

  return (
    <div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <ListImg
          authorized={authorized}
          visibleImgs={image.visibleImgs}
          isFetching={image.isFetching}
          error={image.error}
          openModal={openModal}
          getLikeImg={getLikeImg}
        />
      </Suspense>
      <Modal
        isOpen={image.modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <ModalImg
          authorized={authorized}
          image={image}
          historyAction={history.action}
          closeModal={closeModal}
          getLikeImg={getLikeImg}
          getDirectLinkImg={getDirectLinkImg}
        />
      </Modal>
      <button
        onClick={() => {
          getImages(image.visibleImgs.length)
        }}
      >
        Загрузить ещё
      </button>
    </div>
  )
}

Page.propTypes = {
  image: PropTypes.object.isRequired,
  authorized: PropTypes.bool.isRequired,
  getImages: PropTypes.func.isRequired,
  getLikeImg: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  getDirectLinkImg: PropTypes.func.isRequired,
}
