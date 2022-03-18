import Landing from "../components/Landing";
import TaskManagement from "../components/TaskManagement";

export default [
    {
      path: '/task',
      element: <TaskManagement />  
    },
    {
        path: '/',
        element: <Landing />
    }
]