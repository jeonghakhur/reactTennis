import React, { useState, useEffect } from 'react'

const Test = () => {
  let isScroll = false
  let scrollTime = false
  let isShow = false
  const [scrollEl, setScrollEl] = useState(false)
  const [topEl, setTopEl] = useState(false)

  const show = () => {
    if (isShow !== true) {
      topEl.style.display = 'none'
      // isShow = true
    }
  }

  const hide = () => {
    // if (isShow !== true) return
    topEl.style.display = 'none'
    // isShow = false
  }

  const top = () => {
    scrollEl.scrollTop = 0
  }

  const handleScroll = () => {
    if (isScroll === false) {
      isScroll = true
      hide()
    } else {
      if (scrollTime) clearTimeout(scrollTime)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollTime = setTimeout(() => {
        isScroll = false
        show()
      }, 300)
    }
  }

  useEffect(() => {
    // setScrollEl(document.querySelector('.scroll'))
    // setTopEl(document.querySelector('.top'))
    // scroll.addEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="modal fade show">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header"></div>
          <div className="modal-body">
            <div className="box">box</div>
            <div className="box">box</div>
            <div className="btn-wrap">
              <button>Button</button>
            </div>
            {/* <div className="top" onClick={top} style={{ display: 'none' }}>
              top
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test
