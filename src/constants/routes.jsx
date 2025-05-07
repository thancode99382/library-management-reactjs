import { MdMenuOpen } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaProductHunt, FaBook } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { MdOutlineSettings, MdCategory } from "react-icons/md";
import { BiBookContent } from "react-icons/bi";
import {
 Analytic,
 Wallet,
 Dashboard,
 Setting,
 Message
} from "../pages/index"

export const ROUTES = {
  Dashboard: "/",
  Message: "/message",
  Analytic: "/analytic",
  Wallet: "/wallet",
  Setting: "/setting",
  SignUp: "/signup",
  Login: "/login",
  Books: "/books",
  BookDetails: "/books/:id",
  BookCreate: "/books/create",
  BookEdit: "/books/:id/edit",
  Topics: "/topics",
  TopicDetails: "/topics/:id",
  TopicCreate: "/topics/create",
  TopicEdit: "/topics/:id/edit",
};

export const routerList = [
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard size={30} />,
    href: ROUTES.Dashboard,
    component: Dashboard,
  },
  {
    title: "Books",
    icon: <FaBook size={30} />,
    href: ROUTES.Books,
  },
  {
    title: "Topics",
    icon: <MdCategory size={30} />,
    href: ROUTES.Topics,
  },
  {
    title: "Message",
    icon: <GrTransaction size={30} />,
    href: ROUTES.Message,
    component: Message,
  },
  {
    title: "Wallet",
    icon: <MdOutlineAccountBalanceWallet size={30} />,
    href: ROUTES.Wallet,
    component: Wallet,
  },
  {
    title: "Setting",
    icon: <MdOutlineSettings size={30} />,
    href: ROUTES.Setting,
    component: Setting,
  },
];
