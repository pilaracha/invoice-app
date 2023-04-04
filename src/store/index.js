import { createStore } from "vuex"
import db from "../firebase/firebaseInit"
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import RandomUsersService from "@/services/RandomUsersService";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoice: null,
    editInvoice: null,
    clients: []
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData = [...state.invoiceData, payload];
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      const invoice = state.invoiceData.find((invoice) => invoice.invoiceId === payload);
      state.currentInvoice= invoice ? invoice : null;
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter((invoice) => invoice.docId !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      const invoice = state.invoiceData.find(invoice => invoice.docId === payload);
      if (invoice) {
        invoice.invoicePaid = true;
        invoice.invoicePending = false;
      }
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      const invoice = state.invoiceData.find(invoice => invoice.docId === payload);
      if (invoice) {
        invoice.invoicePaid = false;
        invoice.invoicePending = true;
        invoice.invoiceDraft = false;
      }
    },
    SET_CLIENTS(state, payload){
      state.clients = payload
    }
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      const invoiceCollection = collection(db, 'invoices')
      const results = await getDocs(invoiceCollection)
      results.forEach((doc) => {
        if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit("SET_INVOICE_DATA", data);
        }
      });
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({ commit }, docId) {
      const invoiceRef = doc(db, "invoices", docId);
      await deleteDoc(invoiceRef);
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      try {
        const invoiceRef = doc(db, "invoices", docId);
        await updateDoc(invoiceRef, {
          invoicePaid: true,
          invoicePending: false,
        });
        commit("UPDATE_STATUS_TO_PAID", docId);
      } catch (error) {
        console.error(error);
      }
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      try{
        const invoiceRef = doc(db, "invoices", docId);
        await updateDoc(invoiceRef, {
          invoicePaid: false,
          invoicePending: true,
          invoiceDraft: false,
        });
        commit("UPDATE_STATUS_TO_PENDING", docId);
      } catch (error) {
        console.error(error);
      }
    },

    async GET_CLIENTS({ commit }) {
      try {
        const clientsCollection = await RandomUsersService.getRandomUsers();
        commit("SET_CLIENTS", clientsCollection);
      } catch (error) {
        console.error(error);
      }
    }
  },
  
  modules: {},
});
