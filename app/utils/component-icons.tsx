import React from 'react';
import {
  Box, Type, Square, Image, Link,
  List, Table, CheckSquare, CheckCircle,
  ChevronDown, Calendar, Video, MapPin, Star,
  ToggleLeft, Loader, Sliders, Layout, User,
  Tag, AlertTriangle, Info, Maximize, Navigation,
  Menu
} from 'lucide-react';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';
import { BsInputCursor } from 'react-icons/bs';
import { FiAlignLeft } from 'react-icons/fi';

export const getComponentIcon = (type: string) => {
  switch (type) {
    case 'div': return <Box size={12} />;
    case 'p': return <Type size={12} />;
    case 'h1': return <TbH1 size={12} />;
    case 'h2': return <TbH2 size={12} />;
    case 'h3': return <TbH3 size={12} />;
    case 'button': return <Square size={12} />;
    case 'input': return <BsInputCursor size={12} />;
    case 'textarea': return <FiAlignLeft size={12} />;
    case 'img': return <Image size={12} />;
    case 'a': return <Link size={12} />;
    case 'ul': case 'ol': return <List size={12} />;
    case 'table': return <Table size={12} />;
    case 'checkbox': return <CheckSquare size={12} />;
    case 'radio': return <CheckCircle size={12} />;
    case 'select': return <ChevronDown size={12} />;
    case 'date': return <Calendar size={12} />;
    case 'video': return <Video size={12} />;
    case 'map': return <MapPin size={12} />;
    case 'icon': return <Star size={12} />;
    case 'progress': return <Loader size={12} />;
    case 'slider': return <Sliders size={12} />;
    case 'card': return <Layout size={12} />;
    case 'avatar': return <User size={12} />;
    case 'badge': return <Tag size={12} />;
    case 'alert': return <AlertTriangle size={12} />;
    case 'tooltip': return <Info size={12} />;
    case 'modal': return <Maximize size={12} />;
    case 'breadcrumb': return <Navigation size={12} />;
    case 'menu': return <Menu size={12} />;
    default: return <Box size={12} />;
  }
};