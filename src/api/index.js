
let  gateway = process.env.VUE_APP_API_URL

export const  loginUrl = gateway + "/auth"+"/login"

// site
export const site_delete = gateway + "/site"+"/delete";
export const site_add = gateway + "/site"+"/add";
export const site_update= gateway + "/site"+"/update";
export const site_list= gateway + "/site"+"/list";
export const list_by_env= gateway + "/site"+"/list_by_env";
export const get_site_by_env_name= gateway + "/site"+"/get_site_by_env_name";

// admin
export const get_cluster_name_list = gateway + "/admin"+"/get_cluster_name_list";
export const cluster_list = gateway + "/admin"+"/cluster_list"
export const cluster_enable = gateway + "/admin"+"/cluster_enable"
export const cluster_disable = gateway + "/admin"+"/cluster_disable"
export const cluster_create = gateway + "/admin"+"/cluster_create"

export const get_project_env = gateway + "/admin"+"/get_project_env"
export const get_env_by_project_name = gateway + "/admin"+"/get_env_by_project_name";
export const get_cluster_by_env_name = gateway + "/admin"+"/get_cluster_by_env_name";
export const get_project_list = gateway + "/admin"+"/get_project_list";
export const get_env_list = gateway +  "/admin"+"/get_env_list" 
export const get_env_name_list = gateway +  "/admin"+"/get_env_name_list" 

//blog
export const blog_delete = gateway + "/blog"+"/delete";
export const blog_detail = gateway + "/blog"+"/detail";
export const blog_add = gateway + "/blog"+"/add";
export const blog_update= gateway + "/blog"+"/update";
export const blog_list= gateway + "/blog"+"/list";

// import { get_service_account_list,delete_service_account } from  '@/api'
// auth 
export const get_service_account_list =  gateway + "/k8s"+"/get_service_account_list";
export const delete_service_account  = gateway + "/k8s"+"/delete_service_account"
export const get_cluster_role_binding_list = gateway + "/k8s"+"/get_cluster_role_binding_list"
export const get_cluster_role_list = gateway + "/k8s"+"/get_cluster_role_list"
export const get_cluster_role_detail = gateway + "/k8s"+"/get_cluster_role_detail"
export const get_role_binding_list = gateway + "/k8s"+"/get_role_binding_list"
export const get_role_list = gateway + "/k8s"+"/get_role_list"
export const delete_role = gateway + "/k8s"+"/delete_role"
export const delete_role_binding = gateway + "/k8s"+"/delete_role_binding"
export const get_role_detail = gateway + "/k8s"+"/get_role_detail"

// workload

// config

// storage

// security
export const delete_istio_policy = gateway +  "/k8s"+"/get_virtual_service_list" 
export const get_istio_policy_list = gateway +  "/k8s"+"/get_istio_policy_list" 
export const delete_network_policy = gateway +  "/k8s"+"/delete_network_policy" 
export const get_network_policy_list = gateway +  "/k8s"+"/get_network_policy_list" 

// servcie

// istio
export const get_virtual_service_list = gateway +  "/k8s"+"/get_virtual_service_list" 
export const delete_vs= gateway +  "/k8s"+"/delete_vs" 
export const update_vs= gateway +  "/k8s"+"/update_vs" 
export const get_gateway_list = gateway +  "/k8s"+"/get_gateway_list" 
export const get_destination_rule_list = gateway +  "/k8s"+"/get_destination_rule_list" 


// cluster
export const create_namespace = gateway + "/k8s"+"/create_namespace";
export const get_component_status_list  = gateway + "/k8s"+"/get_component_status_list"

export const get_namespace_name_list =  gateway + "/k8s"+"/get_namespace_name_list";
export const get_cluster_stats  = gateway + "/k8s"+"/get_cluster_stats"
export const get_event_list = gateway + "/k8s"+"/get_event_list" 
export const update_node = gateway + "/k8s"+"/update_node"
export const get_node_detail_list = gateway + "/k8s"+"/get_node_detail_list"
export const get_node_detail_list_v2 = gateway+ "/k8s"+"/get_node_detail_list_v2"
export const get_cm_detail = gateway + "/k8s"+"/get_cm_detail" 
export const delete_configmap = gateway + "/k8s"+"/delete_configmap" 
export const get_configmap_list = gateway +  "/k8s"+"/get_configmap_list" 
export const delete_secret = gateway +  "/k8s"+"/delete_secret" 
export const get_secret_list = gateway +  "/k8s"+"/get_secret_list" 




export const get_secret_detail = gateway +  "/k8s"+"/get_secret_detail" 



export const get_namespace_list = gateway +  "/k8s"+"/get_namespace_list" 
export const delete_namespace = gateway +  "/k8s"+"/delete_namespace" 
export const update_namespace = gateway +  "/k8s"+"/update_namespace" 




export const delete_ingress = gateway +  "/k8s"+"/delete_ingress" 
export const get_ingress_list = gateway +  "/k8s"+"/get_ingress_list" 

export const delete_service = gateway +  "/k8s"+"/delete_service" 
export const get_service_list = gateway +  "/k8s"+"/get_service_list" 

export const delete_multi_pv = gateway +  "/k8s"+"/delete_multi_pv" 
export const delete_pv = gateway +  "/k8s"+"/delete_pv" 
export const get_pv_list = gateway +  "/k8s"+"/get_pv_list" 
export const create_pv = gateway +  "/k8s"+"/create_pv" 

export const delete_pvc = gateway +  "/k8s"+"/delete_pvc" 
export const get_pvc_list = gateway +  "/k8s"+"/get_pvc_list" 

export const get_storageclass_list = gateway +  "/k8s"+"/get_storageclass_list" 

export const get_cronjob_list = gateway +  "/k8s"+"/get_cronjob_list"



export const delete_daemonset = gateway +  "/k8s"+"/delete_daemonset" 
export const get_daemonset_list = gateway +  "/k8s"+"/get_daemonset_list" 

export const get_job_list = gateway +  "/k8s"+"/get_job_list" 

export const update_deploy_v2 = gateway +  "/k8s"+"/update_deploy_v2" 
export const delete_deploy = gateway +  "/k8s"+"/delete_deploy" 

export const get_deployment_detail = gateway +  "/k8s"+"/get_deployment_detail" 

export const delete_pod = gateway +  "/k8s"+"/delete_pod" 
export const get_namespaced_pod_list = gateway +  "/k8s"+"/get_namespaced_pod_list" 
export const get_pod_list_by_node = gateway +  "/k8s"+"/get_pod_list_by_node"
export const get_node_name_list = gateway +  "/k8s"+"/get_node_name_list" 

export const get_hpa_list = gateway +  "/k8s"+"/get_hpa_list" 
export const get_pod_detail = gateway +  "/k8s"+"/get_pod_detail" 

export const delete_statefulset = gateway +  "/k8s"+"/delete_statefulset" 
export const get_statefulset_list = gateway +  "/k8s"+"/get_statefulset_list" 

export const get_deployment_list = gateway +  "/k8s"+"/get_deployment_list" 


