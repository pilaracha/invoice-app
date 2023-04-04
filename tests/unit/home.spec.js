import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('Home', () => {
  test('displays the correct number of invoices', () => {
    const invoiceData = [
      { invoiceDraft: true },
      { invoicePending: true },
      { invoicePaid: true }
    ]
    const wrapper = mount(Home, {
      computed: {
        invoiceData: () => invoiceData
      }
    })
    expect(wrapper.find('.header span').text()).toBe(`There are ${invoiceData.length} total invoices`)
  })

  test('filters invoices by status', () => {
    const invoiceData = [
      { invoiceDraft: true },
      { invoicePending: true },
      { invoicePaid: true }
    ]
    const wrapper = mount(Home, {
      computed: {
        invoiceData: () => invoiceData
      }
    })
    const filterButton = wrapper.find('.filter')
    filterButton.trigger('click')
    const draftOption = wrapper.find('.filter-menu li:nth-child(1)')
    draftOption.trigger('click')
    expect(wrapper.findAll('.invoice').length).toBe(1)
    const pendingOption = wrapper.find('.filter-menu li:nth-child(2)')
    pendingOption.trigger('click')
    expect(wrapper.findAll('.invoice').length).toBe(1)
    const paidOption = wrapper.find('.filter-menu li:nth-child(3)')
    paidOption.trigger('click')
    expect(wrapper.findAll('.invoice').length).toBe(1)
    const clearOption = wrapper.find('.filter-menu li:nth-child(4)')
    clearOption.trigger('click')
    expect(wrapper.findAll('.invoice').length).toBe(3)
  })

  test('displays message when there are no invoices', () => {
    const wrapper = mount(Home, {
      computed: {
        invoiceData: () => []
      }
    })
    expect(wrapper.find('.empty h3').text()).toBe('There is nothing here')
  })
})