import { store } from '../../store'
import * as db from '../../db'
import { getThoughtsRanked } from '../../selectors'
import windowEvent from '../../test-helpers/windowEvent'
import createTestApp from '../../test-helpers/createTestApp'
import { act } from 'react-dom/test-utils'

beforeEach(async () => {
  await createTestApp()
})

afterEach(async () => {
  store.dispatch({ type: 'clear' })
  await db.clearAll()
})

// test basic thought operations using fully mounted app
it('create, navigate, and edit thoughts', async () => {

  // create thought
  windowEvent('keydown', { key: 'Enter' })
  document.wrapper.update()
  const editable = document.wrapper.find('div.editable')
  await editable.simulate('change', { target: { value: 'a' } })

  // create subthought
  windowEvent('keydown', { key: 'Enter', ctrlKey: true })
  document.wrapper.update()
  const editableSubthought = document.wrapper.find('.children .children div.editable')
  await editableSubthought.simulate('change', { target: { value: 'a1' } })

  // cursor back
  windowEvent('keydown', { key: 'Escape' })

  // create top subthought
  windowEvent('keydown', { key: 'Enter', shiftKey: true, ctrlKey: true })

  act(jest.runOnlyPendingTimers)

  // state
  const subthoughts = getThoughtsRanked(store.getState(), ['a'])
  expect(subthoughts).toHaveLength(2)
  expect(subthoughts[0]).toMatchObject({ value: '', rank: -1 })
  expect(subthoughts[1]).toMatchObject({ value: 'a1', rank: 0 })

  // DOM
  document.wrapper.update()
  const editableSubthoughts2 = document.wrapper.find('.children .children div.editable')
  expect(editableSubthoughts2).toHaveLength(2)
  expect(editableSubthoughts2.at(0).text()).toBe('')
  expect(editableSubthoughts2.at(1).text()).toBe('a1')

})
