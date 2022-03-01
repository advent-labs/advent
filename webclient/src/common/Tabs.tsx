import Tab from '../blocks/Tab'

export type TabType = 'filled' | 'underline' | 'plain'

export interface TabsProps {
  options: string[]
  current: string
  type: TabType
  handler: any
}

function Tabs({ options, current, type, handler }: TabsProps) {
  const displayTabs = options.map((e, i) => {
    const isActive = e === current
    return <Tab text={e} key={i} isActive={isActive} handler={handler} />
  })

  return <div className={`tabs is-${type}`}>{displayTabs}</div>
}

export default Tabs
