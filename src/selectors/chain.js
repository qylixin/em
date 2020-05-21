// util
import {
  equalThoughtRanked,
  head,
  splice,
} from '../util'

import {
  getContextsSortedAndRanked,
} from '../selectors'

/** Merges thoughts into a context chain, removing the overlapping head */
// use autogenerated rank of context
// if there is no/empty context chain, return thoughtsRanked as-is
const chain = (state, contextChain, thoughtsRanked) => {

  if (!contextChain || contextChain.length === 0) return thoughtsRanked

  const pivot = head(contextChain[contextChain.length - 1])
  const i = thoughtsRanked.findIndex(child => equalThoughtRanked(child, pivot))
  const append = thoughtsRanked.slice(i - 1)
  const contexts = getContextsSortedAndRanked(state, pivot.value)
  const appendedThoughtInContext = contexts.find(child => head(child.context) === append[0].value)

  // keep the first segment intact
  // then remove the overlapping head of each one after
  return contextChain
    .concat([
      appendedThoughtInContext
        ? [{ value: append[0].value, rank: appendedThoughtInContext.rank }].concat(append.slice(1))
        : append
    ])
    .map((thoughts, i) => i > 0 ? splice(thoughts, 1, 1) : thoughts)
    .flat()
}

export default chain
