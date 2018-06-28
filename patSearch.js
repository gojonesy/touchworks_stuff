// In order to use in dev from a localhost call, you have to use the cors-anywhere
// prefix. Otherwise, it can come off.
const baseUrl = "http://cors-anywhere.herokuapp.com/http://twlatestga.unitysandbox.com/unity/unityservice.svc"
const appName = "MemorialMedicalCenter.PHEnOM.TestApp"
const svcUserName = "Memor-6aa2-PHEnOM-test"
const svcPassword = "M%7!rf@cm0d7C@8C%nT4rPh6N!fT%s"

const Ehr_username = "jmedici"
const Ehr_password = "password01"

var getApiCall = function (action, appname, unitytoken, ehruserid='', patientid='', param1='', param2='', param3='', param4='', param5='', param6='', data='') {
  //console.log(action);
  return {
    'Action': action,
    'Appname': appname,
    'AppUserID': ehruserid,
    'PatientID': patientid,
    'Token': unitytoken,
    'Parameter1': param1,
    'Parameter2': param2,
    'Parameter3': param3,
    'Parameter4': param4,
    'Parameter5': param5,
    'Parameter6': param6,
    'Data': data
  }
};

var headers = {
  'Content-Type': 'application/json'
}
var nv = new Vue({
  el: '#vue-app',
  data: {
    msg: "",
    results: '',
    errors: '',
    searchString: '',
    token: '',
    token_received: false,
    details: '',
    orders: '',
    noOrders: false,
    statuses: [],
    types: [],
    raw: ''
  },
  computed: {

  },
  mounted() {
    axios.post(baseUrl + '/json/GetTokenJson', {
      'Username': svcUserName,
      'Password': svcPassword
    })
    .then(response => {
      //console.log("Token: " + response.data.token);
      token = response.data.token
      this.token_received = true;
    })
    .catch(e => {
      console.log("Caught through GetTokenJson" + e);
    })
  },
  methods: {
    patientSearch: function () {
        var data = getApiCall("SearchPatients", appName, token, Ehr_username, "", this.searchString)
        axios.post(baseUrl + '/json/MagicJson', data, headers)
        .then(response => {
          this.results = response.data[0].searchpatientsinfo;
          console.log(response.data[0].searchpatientsinfo);
        })
        .catch(e => {
          this.errors = e;
          //console.log(e);
        });


    },
    getPatient: function(patID, event) {
      var data = getApiCall("GetPatient", appName, token, Ehr_username, patID)
      axios.post(baseUrl + '/json/MagicJson', data, headers)
      .then(response => {
        this.details = response.data[0].getpatientinfo[0];
        console.log(response.data[0].getpatientinfo[0]);
      })
      .catch(e => {
        this.errors = e;
        //console.log(e);
      });
    },
    getPatientOrders: function(patID, event) {
      // Get the status and Type
      var data = getApiCall("GetOrders", appName, token, Ehr_username, patID, "", "", this.statuses.join("|"), this.types.join("|"))
      axios.post(baseUrl + '/json/MagicJson', data, headers)
      .then(response => {
        this.orders = response.data[0].getordersinfo;
        if (this.orders.length == 0) {
          this.noOrders = true
        }
      })
      .catch(e => {
        this.errors = e;
        console.log(e);
      });
    },
    getClinicalSummary: function(patID, event) {
      // Get the clinical summary info.
      var data = getApiCall("GetClinicalSummary", appName, token, Ehr_username, patID, 'Medications')
      axios.post(baseUrl + '/json/MagicJson', data, headers)
      .then(response => {
        this.raw = response.data;
      })
    },
    closeModal: function() {
      console.log("Closing Modal")
      this.orders = "";
      this.details = "";
      this.noOrders = false;
      this.raw = "";
    }
  }
})
