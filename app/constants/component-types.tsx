import React from 'react';
import {
  Box, Type, Square, Image, Link as LinkIcon,
  List, Table, CheckSquare, CheckCircle,
  ChevronDown, Calendar, Video, MapPin, Star,
  ToggleLeft, Loader, Sliders, Layout, User,
  Tag, AlertTriangle, Info, Maximize, Navigation,
  Menu as MenuIcon
} from 'lucide-react';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';
import { BsInputCursor } from 'react-icons/bs';
import { FiAlignLeft } from 'react-icons/fi';
import { MdRateReview } from 'react-icons/md';
import { ComponentType } from '~/types/editor';

export const componentTypes: ComponentType[] = [
  { type: 'div', name: 'Container', icon: <Box /> },
  { type: 'p', name: 'Paragraph', icon: <Type /> },
  { type: 'h1', name: 'Heading 1', icon: <TbH1 /> },
  { type: 'h2', name: 'Heading 2', icon: <TbH2 /> },
  { type: 'h3', name: 'Heading 3', icon: <TbH3 /> },
  { type: 'button', name: 'Button', icon: <Square /> },
  { type: 'input', name: 'Input', icon: <BsInputCursor /> },
  { type: 'textarea', name: 'Text Area', icon: <FiAlignLeft /> },
  { type: 'img', name: 'Image', icon: <Image /> },
  { type: 'a', name: 'Link', icon: <LinkIcon /> },
  { type: 'ul', name: 'Unordered List', icon: <List /> },
  { type: 'ol', name: 'Ordered List', icon: <List /> },
  { type: 'table', name: 'Table', icon: <Table /> },
  { type: 'checkbox', name: 'Checkbox', icon: <CheckSquare /> },
  { type: 'radio', name: 'Radio', icon: <CheckCircle /> },
  { type: 'select', name: 'Select', icon: <ChevronDown /> },
  { type: 'date', name: 'Date Picker', icon: <Calendar /> },
  { type: 'video', name: 'Video', icon: <Video /> },
  { type: 'map', name: 'Map', icon: <MapPin /> },
  { type: 'rating', name: 'Rating', icon: <MdRateReview /> },
  { type: 'toggle', name: 'Toggle', icon: <ToggleLeft /> },
  { type: 'icon', name: 'Icon', icon: <Star /> },
  { type: 'progress', name: 'Progress Bar', icon: <Loader /> },
  { type: 'slider', name: 'Slider', icon: <Sliders /> },
  { type: 'card', name: 'Card', icon: <Layout /> },
  { type: 'avatar', name: 'Avatar', icon: <User /> },
  { type: 'badge', name: 'Badge', icon: <Tag /> },
  { type: 'alert', name: 'Alert', icon: <AlertTriangle /> },
  { type: 'tooltip', name: 'Tooltip', icon: <Info /> },
  { type: 'modal', name: 'Modal', icon: <Maximize /> },
  { type: 'breadcrumb', name: 'Breadcrumb', icon: <Navigation /> },
  { type: 'menu', name: 'Menu', icon: <MenuIcon /> },
];