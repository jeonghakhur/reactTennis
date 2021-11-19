import React, { useState, useEffect, useCallback } from 'react'

import _ from 'lodash'

const GameRanking = ({data}) => {
  // console.clear()
  let gamsArray = []
  let members = []

  
  const getUserGame = (data, user) => {
    const tmp = user.map(name => {
      const obj = {}
      obj.name = name
      obj.games = data.filter(game => game.player.indexOf(name) !== -1)
      return obj
    })
    
    console.log(tmp)
  }

  const getMember = (player) => {
    player.forEach(name => {
      if (members.indexOf(name) === -1) {
        members.push(name)
      }
    })
  }

  const init = (data) => {
    if (!data) return

    data.forEach(val => {
      val.games.forEach(game => {
        if (game.player[0] !== '') {
          getMember(game.player)
          gamsArray.push(game)
        }
      })
    })

    getUserGame(gamsArray, members)
  }


  useEffect(() => {
    init(data)
  }, [data])
  // useEffect(() => {

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div>
      asdf
      {/* <div className="scroll-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>승</th>
              <th>무</th>
              <th>패</th>
              <th>게임</th>
              <th>승점</th>
              <th>승률</th>
              <th>득점</th>
              <th>실점</th>
              <th>마진</th>
            </tr>
          </thead>
          <tbod>
            {game()}
          </tbod>
        </table>
      </div> */}
    </div>
  )
}

export default GameRanking
