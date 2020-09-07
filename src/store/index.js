


export default {
    debug: true,
    state: {
        clusterName: '',
        namespace: '',
        clusterList: [],
        namespaceList: [],
    },
    setClusterName (newValue) {
        if(this.debug)
            console.log('setClusterName trigger with',newValue);
        this.state.clusterName = newValue;
    },
    setClusterList(newValue) {
        if(this.debug)
            console.log('setClusterList trigger with',newValue);
        this.state.clusterList = newValue;
    },

    setNamespace(newValue) {
        if(this.debug)
            console.log('setNamespace trigger with',newValue);
        this.state.namespace = newValue;
    },
    setNamespaceList(newValue) {
        if(this.debug)
            console.log('setNamespaceList trigger with',newValue);
        this.state.namespaceList = newValue;
    },
    clear() {
        if(this.debug)
            console.log('clear trigger '); 
        this.state.clusterName = '';
        this.state.namespace = 'default';
    },


}