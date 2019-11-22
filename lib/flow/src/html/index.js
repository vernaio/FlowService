var app = new Vue({
    el: '#app',
    data: {
        activeJobs: [],
        filesDataIn: [],
        spoSettings: null,
        version: null,
        impVersion: null,
    },
    mounted() {
        var self = this;

        // load periodical data
        this.loadPeriodical();
        setInterval(function () { self.loadPeriodical() }, 2000);

        // load version details (static)
        axios
            .get('/version')
            .then(response => (this.version = response.data));

        // load SPO Settings (static)
        axios
            .get('/controller/spo-settings')
            .then(response => (this.spoSettings = response.data));
    },
    methods: {

        /**
         * Reset a job from active processing.
         * @param {string} jobId 
         */
        resetActiveJob: function (jobId) {
            axios
                .delete('/controller/active-jobs/' + jobId)
                .then(response => (this.loadPeriodical()));
        },

        /**
         * Reset all jobs from active processing.
         */
        resetActiveJobs: function () {
            axios
                .delete('/controller/active-jobs')
                .then(response => (this.loadPeriodical()));
        },

        /**
         * Scan Data-In folder for new jobs.
         */
        scanDataIn: function() {
            axios
                .post('/controller/files/scan');
        },

        /**
         * Periodical refresh.
         */
        loadPeriodical: function () {
            console.log("loadPeriodical.")

            // load imposition details
            axios
                .get('/controller/imposition')
                .then(response => { this.impVersion = response.data })

            // load files data in
            axios
                .get('/controller/files/data-in')
                .then(response => (this.filesDataIn = response.data));

            // load active jobs
            axios
                .get('/controller/active-jobs')
                .then(response => (this.activeJobs = response.data));
        }
    },
    filters: {
        datetime: function (value) {
            var d = new Date(value);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString();
        }
    }
})

var head = new Vue({
    el: '#head',
    data: {
        consoleLink: null
    },
    mounted() {
        // load SPO Settings (static)
        axios
            .get('/controller/spo-settings')
            .then(response => {
                this.consoleLink = "https://" + response.data.url.split("web-apps.")[1] + "/sPrint.one.cockpit.v2.webClient/current";
            });
    }
})