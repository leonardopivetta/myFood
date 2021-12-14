import {Link} from 'react-router-dom';
import { listPages } from '../../data';

export const Selector = ()=> {
     return (<div className='flex align-middle items-center h-screen w-screen'>
         {
            listPages.map(item => (<Link to={item.path} className='mx-auto rounded-xl px-10 py-10 bg-secondary hover:bg-primary duration-150'>{item.title}</Link>))
         }
     </div>);
}