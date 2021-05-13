const reducer = (state = '', action) => {
  switch (action.type) {
    case 'FILTER/SET':
      return action.data.filterText
    default:
      return state
  }
}

export const createFilter = (filterText) => {
  return {
    type: 'FILTER/SET',
    data: { filterText }
  }
}

export default reducer
