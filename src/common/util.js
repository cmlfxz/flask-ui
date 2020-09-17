import axios from 'axios'
export function delete_cluster_resource(name,url){
    let cluster = localStorage.getItem('currentCluster')
    let headers = {"cluster_name": cluster }
    let data = JSON.stringify({"name":name})
    let method='post'
    if(cluster){
        axios({
            url:url,headers: headers,data:data,method:method
        }).then( (response) => {
            let info = JSON.stringify(response.data)
            if(info.indexOf('ok') != -1) {
                alert('删除'+name+'成功')
                return true
            }else {
                alert("删除失败:",info)
                return false
            }
        }).catch(function (error){
            alert("请求异常:",error)
            return false
        })
    }
}
var forbidden_delete_namespace_list = ['ingress-nginx','istio-system','kube-node-leas','kube-public','monitoring','kube-system','kube-ops']
export function delete_namespace_resource(namespace,name,url){
    if (forbidden_delete_namespace_list.indexOf(namespace) != -1){
        alert("核心系统资源不允许删除")
        return
    }
    let cluster = localStorage.getItem('currentCluster')
    let headers = {"cluster_name": cluster }
    let data = JSON.stringify({"namespace":namespace,"name":name})
    let method='post'
    if(cluster){
        axios({
            url:url,headers: headers,data:data,method:method
        }).then( (response) => {
            let info = JSON.stringify(response.data)
            if(info.indexOf('ok') != -1) {
                alert('删除'+name+'成功')
                return true
            }else {
                alert("删除失败:",info)
                return false
            }
        }).catch(function (error){
            alert("请求异常:",error)
            return false
        })
    }
}

export function delete_ns(name,url){
    if (forbidden_delete_namespace_list.indexOf(name) != -1){
        alert("核心系统资源不允许删除")
        return
    }
    let cluster = localStorage.getItem('currentCluster')
    let headers = {"cluster_name": cluster }
    let data = JSON.stringify({"name":name})
    let method='post'
    if(cluster){
        axios({
            url:url,headers: headers,data:data,method:method
        }).then( (response) => {
            let info = JSON.stringify(response.data)
            if(info.indexOf('ok') != -1) {
                alert('删除'+name+'成功')
                return true
            }else {
                alert("删除失败:",info)
                return false
            }
        }).catch(function (error){
            alert("请求异常:",error)
            return false
        })
    }
}