import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { HeaderComponent } from './components/header/HeaderComponent';
import { DrawerComponent } from './components/header/DrawerComponent';
import { HomeScreen } from './components/screens/HomeScreen';
import { ContainersScreen } from './components/screens/container/ContainersScreen';
import { ContainerDetailScreen } from './components/screens/container/ContainerDetailScreen';
import { ImagesScreen } from './components/screens/image/ImageScreen';
const queryClient = new QueryClient();

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
  <QueryClientProvider client={queryClient}> 
    <BrowserRouter>
        <HeaderComponent onToggleDrawer={() => setIsDrawerOpen(true)}/>
          <DrawerComponent open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}/>  
            <Routes>
              <Route path="/" element={<HomeScreen/>} />
              <Route path="/containers" element={<ContainersScreen/>} />
              <Route path="/containers/:id" element={<ContainerDetailScreen/>} />
              <Route path="/images" element={<ImagesScreen/>} />
              <Route path="/volumes" element={<div>volumes</div>} />
              <Route path="/networks" element={<div>networks</div>} />
            </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  )
}

export default App
