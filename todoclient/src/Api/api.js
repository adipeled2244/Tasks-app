import axios from 'axios';

export const createApiClient = () => {
    const urlStart = 'http://localhost:3001';

    return {
        getTasks: async (searchText) => {
            let url= `${urlStart}/api/tasks`;
            
            if(searchText){
                 url= `${urlStart}/api/tasks?searchText=${searchText}`;
            }
            
            const res = await axios.get(url);
            return res.data;
        },
        getTask : async (id) => {
            const url= `${urlStart}/api/tasks/${id}`;
            const res = await axios.get(url);
            return res.data;
        },
        addTask : async (task) => {
            const url= `${urlStart}/api/tasks`;
            const res = await axios.post(url,task);
            return res.data;
        },
        updateTask : async (id,updates) => {
            const url= `${urlStart}/api/tasks/${id}`;
            const res = await axios.patch(url,updates);
            return res.data;
        },
        deleteTask : async (id) => {
            const url= `${urlStart}/api/tasks/${id}`;
            const res = await axios.delete(url);
            return res.data;
        }



    }

}