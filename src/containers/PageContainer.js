import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getImages,
  getLikeImg,
  openModal,
  getDirectLinkImg,
} from '../actions/ImgActions'

import Page from '../components/Page'

function PageContainer(props) {
  const {
    image,
    authorized,
    getImages,
    getLikeImg,
    openModal,
    getDirectLinkImg,
  } = props

  return (
    <div>
      <Page
        getDirectLinkImg={getDirectLinkImg}
        getImages={getImages}
        getLikeImg={getLikeImg}
        image={image}
        openModal={openModal}
        authorized={authorized}
      />
    </div>
  )
}

const mapStateToProps = (store) => {
  return {
    image: store.image,
    authorized: store.user.authorized,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getImages: (quantImg) => dispatch(getImages(quantImg)),
    getLikeImg: (img) => dispatch(getLikeImg(img)),
    openModal: (img, modal, status) => dispatch(openModal(img, modal, status)),
    getDirectLinkImg: (id) => dispatch(getDirectLinkImg(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer)

PageContainer.propTypes = {
  image: PropTypes.object.isRequired,
  authorized: PropTypes.bool.isRequired,
  getImages: PropTypes.func.isRequired,
  getLikeImg: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  getDirectLinkImg: PropTypes.func.isRequired,
}
