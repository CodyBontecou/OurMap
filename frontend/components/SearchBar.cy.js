import { mount, createLocalVue } from '@cypress/vue'
import SearchBar from './SearchBar.vue'

describe('SearchBar', () => {
  it('renders the SearchBar', () => {
    mount(SearchBar)
  })
})
