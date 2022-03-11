import { useMemo } from 'react'
import Tabs from './Tabs'
import Container from '../blocks/Container'
import { useAppDispatch, useAppSelector } from '../redux'
import { useContext, useEffect } from 'react'
import { Context } from '../App'
import fixed from '../assets/fixed.svg'
import variable from '../assets/variable.svg'
import UserReserve from './UserReserve'
import { actions as uiActions } from '../redux/ui/dashboard'

export interface UserRowProps {
  currentTab: string
  tabHandler: any
}

function UserRows({ currentTab, tabHandler }: UserRowProps) {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()

  const tabOptions = ['All', 'Fixed rate', 'Variable rate']
  const reserves = useAppSelector((s) => s.reserves.state)

  const mockDataFixed = [
    {
      value: 6.56,
      currency: '%',
      loadedOnce: true,
      icon: fixed,
      id: 'rate',
    },
    {
      value: 45000.32,
      currency: 'USDC',
      loadedOnce: true,
      id: 'supply',
    },
    {
      value: 64,
      currency: 'd',
      loadedOnce: true,
      id: 'term',
    },
    {
      value: 100,
      currency: '%',
      loadedOnce: true,
      id: 'collateral',
    },
  ]

  const mockDataVar = [
    {
      value: 7.12,
      currency: '%',
      loadedOnce: true,
      icon: variable,
      id: 'rate',
    },
    {
      value: 0,
      currency: 'USDC',
      loadedOnce: true,
      id: 'supply',
    },
    {
      value: 64,
      currency: 'd',
      loadedOnce: true,
      id: 'term',
    },
    {
      value: 100,
      currency: '%',
      loadedOnce: true,
      id: 'collateral',
    },
  ]

  const fixedData = reserves.map((e, i) => {
    const mintMeta = addresses?.mintMetaMap[e.token]
    const { name, icon } = mintMeta
    return {
      icon: icon,
      uTokenName: name,
      mint: e.token,
      data: mockDataFixed,
    }
  })

  const varData = reserves.map((e, i) => {
    const mintMeta = addresses?.mintMetaMap[e.token]
    const { name, icon } = mintMeta
    return {
      icon: icon,
      uTokenName: name,
      mint: e.token,
      data: mockDataVar,
    }
  })

  const allData = useMemo(
    () => [...fixedData, ...varData],
    [fixedData, varData],
  )

  useEffect(() => {
    console.log(allData[0])
    // dispatch(uiActions.setData(allData[0]))
  }, [dispatch, allData])

  const onUserReserveClick = (data: any) => {
    dispatch(uiActions.setData(data))
    dispatch(uiActions.openCollateralSwitch())
  }

  const rows = () => {
    if (currentTab === 'All') {
      return allData.map((e, i) => (
        <UserReserve {...e} key={i} action={() => onUserReserveClick(e)} />
      ))
    } else if (currentTab === 'Fixed rate') {
      return fixedData.map((e, i) => (
        <UserReserve {...e} key={i} action={() => onUserReserveClick(e)} />
      ))
    } else if (currentTab === 'Variable rate') {
      return varData.map((e, i) => (
        <UserReserve {...e} key={i} action={() => onUserReserveClick(e)} />
      ))
    }
  }

  const rowLabels = (
    <div className="columns is-mobile text-left">
      <p className="column is-3 text__medium-m is-grey-1">Asset</p>
      <p className="column is-2 text__medium-m is-grey-1">Rate</p>
      <p className="column is-3 text__medium-m is-grey-1">Supply balance</p>
      <p className="column is-2 text__medium-m is-grey-1">Term left</p>
      <p className="column text__medium-m is-grey-1">Collateral</p>
    </div>
  )

  return (
    <Container type="background" xtra="user-rows br__12 mt__2">
      <div className="tab-container">
        <Tabs
          options={tabOptions}
          current={currentTab}
          type="filled"
          handler={tabHandler}
        />
      </div>
      {rowLabels}
      {rows()}
    </Container>
  )
}

export default UserRows
