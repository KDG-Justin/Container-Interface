import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { HeaderComponent } from './components/header/HeaderComponent';
import { DrawerComponent } from './components/header/DrawerComponent';
import { HomeScreen } from './components/screens/HomeScreen';
import { ContainersScreen } from './components/screens/container/ContainersScreen';
import { ContainerDetailScreen } from './components/screens/container/ContainerDetailScreen';
import { ImagesScreen } from './components/screens/image/ImagesScreen';
import { ImageDetailScreen } from './components/screens/image/ImageDetailScreen';
import { VolumesScreen } from './components/screens/volume/VolumesScreen';
import { VolumeDetailScreen } from './components/screens/volume/VolumeDetailScreen';
import { NetworksScreen } from './components/screens/network/NetworksScreen';
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
              <Route path="/images/:id" element={<ImageDetailScreen/>} />
              <Route path="/volumes" element={<VolumesScreen/>} />
              <Route path="/volumes/:name" element={<VolumeDetailScreen/>} />
              <Route path="/networks" element={<NetworksScreen/>} />
            </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  )
}

export default App
