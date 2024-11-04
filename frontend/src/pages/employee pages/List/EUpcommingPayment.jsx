import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Modal } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../listItems";
import { Backdrop, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import image1 from "../../../images/1.png";
import image2 from "../../../images/2.png";
import image3 from "../../../images/3.png";
import image4 from "../../../images/4.png";
import image5 from "../../../images/5.png";
import image from "../../../images/image.png";

import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();
const EUpcommingPayment = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1; // JavaScript months are 0-based counting
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const [statusFilter, setStatusFilter] = React.useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [emiNumber, setemiNumber] = useState("");
  const [customerName, setcustomerName] = useState("");
  const [civilID, setcivilID] = useState("");
  const [price, setprice] = useState("");
  const [months, setmonths] = useState("");
  const [advance, setadvance] = useState("");
  const [balance, setbalance] = useState("");
  const [salesDateFrom, setsalesDateFrom] = useState(null);
  const [salesDateTo, setsalesDateTo] = useState(null);
  const [totalReceivable, setTotalReceivable] = useState(0);

  const [totalReceivableTransactions, setTotalReceivableTransactions] =
    useState(0);

  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPaidTransactions, setTotalPaidTransactions] = useState(0);

  const [totalDueToday, setTotalDueToday] = useState(0);
  const [totalDueTodayTransactions, setTotalDueTodayTransactions] = useState(0);

  const [totalOverdue, setTotalOverdue] = useState(0);
  const [totalOverdueTransactions, setTotalOverdueTransactions] = useState(0);

  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalUnpaidTransactions, setTotalUnpaidTransactions] = useState(0);

  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmountForMonth, setTotalAmountForMonth] = useState(0);

  const [totalPaidToday, setTotalPaidToday] = useState(0);
  const [totalPaidTodayTransactions, setTotalPaidTodayTransactions] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch selling data
        const sellingResponse = await fetch(
          "https://app.smartco.live/selling/getSelling",
          { method: "GET" }
        );
        if (!sellingResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const sellingData = await sellingResponse.json();
        console.log("Fetched selling data:", sellingData);

        // Fetch inventory data
        const inventoryResponse = await fetch(
          "https://app.smartco.live/inventory/getInventory",
          { method: "GET" }
        );
        if (!inventoryResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const inventoryData = await inventoryResponse.json();
        console.log("Fetched inventory data:", inventoryData);

        // Fetch customer data
        const customerResponse = await fetch(
          "https://app.smartco.live/api/customer/",
          { method: "GET" }
        );
        if (!customerResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const customerData = await customerResponse.json();
        console.log("Fetched customer data:", customerData);

        // Create a map for customer data by civil_id
        const customerMap = customerData.reduce((map, customer) => {
          map[customer.civil_id] = customer;
          return map;
        }, {});
        console.log("Customer map:", customerMap);

        // Get the current date
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based (0 = January)
        const currentYear = now.getFullYear();
        const currentDate = now.getDate();
        const currentDateString = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        console.log("Current date:", currentDateString);

        // Helper function to validate date format
        const isValidDate = (dateString) => {
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          return dateString.match(regex) !== null;
        };

        // Filter and process selling data based on customArray dates
        const filteredSellingData = sellingData
          .map((sellingItem) => {
            // Extract current month payments from customArray
            const currentMonthPayments = sellingItem.customArray.filter(
              (payment) => {
                const paymentDate = new Date(payment.date);
                return (
                  paymentDate.getMonth() === currentMonth &&
                  paymentDate.getFullYear() === currentYear
                );
              }
            );

            const currentMonthAmount = currentMonthPayments.reduce(
              (sum, payment) => sum + parseFloat(payment.price),
              0
            );
            const currentMonthDate =
              currentMonthPayments.length > 0
                ? currentMonthPayments[0].date
                : "N/A";

            // Determine the status
            const status = sellingItem.customArray.reduce((status, payment) => {
              const paymentDate = new Date(payment.date);
              const paymentDateString = paymentDate.toISOString().split("T")[0];

              if (payment.status === "paid") {
                return status !== "Overdue" && status !== "Due Today"
                  ? "Paid"
                  : status;
              } else if (
                paymentDateString === currentDateString &&
                status !== "Overdue"
              ) {
                return "Due Today"; // Priority for Due Today
              } else if (payment.status === "unpaid" && paymentDate < now) {
                return "Overdue"; // Priority for Overdue
              } else if (payment.status === "unpaid" && paymentDate >= now) {
                return status !== "Overdue" &&
                  status !== "Due Today" &&
                  status !== "Paid"
                  ? "Unpaid"
                  : status;
              }
              return status; // Maintain the status if already set
            }, "Unknown");

            // Validate date
            if (!isValidDate(currentMonthDate) && currentMonthDate !== "N/A") {
              console.warn(`Invalid date format: ${currentMonthDate}`);
            }

            return {
              ...sellingItem,
              currentMonthAmount: Math.round(currentMonthAmount), // Round to nearest number
              currentMonthDate, // Adding current month date
              status: status || "Unknown", // Ensure status is always a string
            };
          })
          .filter((item) => item.currentMonthAmount > 0); // Only include items with amount for the current month

        // Merge sellingData with inventoryData and customerData
        const mergedData = filteredSellingData.map((sellingItem) => {
          const inventoryItem = inventoryData.find(
            (item) => item.emiNumber === sellingItem.emiNumber
          );
          const customer = customerMap[sellingItem.civilID] || {};

          const totalPaid =
            parseFloat(sellingItem.advance) +
            sellingItem.customArray
              .filter((payment) => payment.status === "paid")
              .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

          let totalPayableBalance = sellingItem.customArray
            .filter((payment) => payment.status === "unpaid")
            .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

          totalPayableBalance = Math.round(totalPayableBalance);

          const purchasePrice = inventoryItem
            ? parseFloat(inventoryItem.price)
            : 0;
          const sellingPrice = parseFloat(sellingItem.price);
          const profit = sellingPrice - purchasePrice;

          return {
            ...sellingItem,
            totalPaid: Math.round(totalPaid), // Round to nearest number
            purchasePrice: Math.round(purchasePrice), // Round to nearest number
            profit: Math.round(profit), // Round to nearest number
            totalPayableBalance, // Already rounded
            customerMobile: customer.mobile || "N/A", // Adding customer mobile number
          };
        });

        console.log("Merged data:", mergedData);

        setOriginalData(mergedData);
        setData(mergedData);

        // Calculate totals
        const totalReceivable = Math.round(
          mergedData.reduce(
            (sum, item) => sum + parseFloat(item.totalPayableBalance),
            0
          )
        );
        const totalReceivableTransactions = mergedData.length;

        const totalPaid = Math.round(
          mergedData
            .filter((item) => item.status === "Paid")
            .reduce((sum, item) => sum + parseFloat(item.currentMonthAmount), 0)
        );
        const totalPaidTransactions = mergedData.filter(
          (item) => item.status === "Paid"
        ).length;

        const totalDueToday = Math.round(
          mergedData
            .filter((item) => item.status === "Due Today")
            .reduce((sum, item) => sum + parseFloat(item.currentMonthAmount), 0)
        );
        const totalDueTodayTransactions = mergedData.filter(
          (item) => item.status === "Due Today"
        ).length;

        const totalOverdue = Math.round(
          mergedData
            .filter((item) => item.status === "Overdue")
            .reduce((sum, item) => sum + parseFloat(item.currentMonthAmount), 0)
        );
        const totalOverdueTransactions = mergedData.filter(
          (item) => item.status === "Overdue"
        ).length;

        const totalUnpaid = Math.round(
          mergedData
            .filter((item) => item.status === "Unpaid")
            .reduce((sum, item) => sum + parseFloat(item.currentMonthAmount), 0)
        );
        const totalUnpaidTransactions = mergedData.filter(
          (item) => item.status === "Unpaid"
        ).length;

        const totalTransactions = mergedData.length;
        const totalAmountForMonth = Math.round(
          mergedData.reduce(
            (sum, item) => sum + parseFloat(item.currentMonthAmount),
            0
          )
        );

        // Today's paid and total paid today transactions
      const totalPaidToday = Math.round(
        mergedData
          .filter((item) =>
            item.customArray.some(
              (payment) =>
                payment.status === "paid" &&
                new Date(payment.date).toISOString().split("T")[0] ===
                  currentDateString
            )
          )
          .reduce((sum, item) => {
            return (
              sum +
              item.customArray
                .filter(
                  (payment) =>
                    payment.status === "paid" &&
                    new Date(payment.date).toISOString().split("T")[0] ===
                      currentDateString
                )
                .reduce((paymentSum, payment) => paymentSum + payment.price, 0)
            );
          }, 0)
      );

      const totalPaidTodayTransactions = mergedData.filter((item) =>
        item.customArray.some(
          (payment) =>
            payment.status === "paid" &&
            new Date(payment.date).toISOString().split("T")[0] ===
              currentDateString
        )
      ).length;



        setTotalReceivable(totalReceivable);
        setTotalReceivableTransactions(totalReceivableTransactions);

        setTotalPaid(totalPaid);
        setTotalPaidTransactions(totalPaidTransactions);

        setTotalDueToday(totalDueToday);
        setTotalDueTodayTransactions(totalDueTodayTransactions);

        setTotalOverdue(totalOverdue);
        setTotalOverdueTransactions(totalOverdueTransactions);

        setTotalUnpaid(totalUnpaid);
        setTotalUnpaidTransactions(totalUnpaidTransactions);

        setTotalTransactions(totalTransactions);
        setTotalAmountForMonth(totalAmountForMonth);

        setTotalPaidToday(totalPaidToday);
        setTotalPaidTodayTransactions(totalPaidTodayTransactions);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    // Create a copy of the data with the totalPaid calculated
    const updatedData = data.map((item) => {
      const totalPaid =
        parseFloat(item.advance) +
        item.customArray
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

      // Create a new object excluding 'advance' and including 'totalPaid'
      const { advance, ...rest } = item;
      return { ...rest, totalPaid: totalPaid.toFixed(2) };
    });

    // Prepare the payload with both data and statistics
    const payload = {
      data: updatedData,
      statistics: {
        totalPaid,
        totalPaidTransactions,
        totalDueToday,
        totalDueTodayTransactions,
        totalOverdue,
        totalOverdueTransactions,
        totalUnpaid,
        totalUnpaidTransactions,
        totalTransactions,
        totalAmountForMonth,
      },
    };

    console.log(payload);

    fetch(
      "https://app.smartco.live/api/convertToupcomingPaymentPDF/convertToupcomingPaymentPDF",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the updated data and statistics to the backend
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.blob(); // If the response is OK, get the PDF blob
        } else {
          throw new Error("Error converting to PDF");
        }
      })
      .then((blob) => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        const now = new Date();
        const formattedDateTime = `${now.getDate()}/${
          now.getMonth() + 1
        }/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`;
        link.download = `upcoming Payment Pdf Report - ${formattedDateTime}.pdf`;
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click
        link.click();
        // Remove the link when done
        document.body.removeChild(link);
      })
      .catch((error) => alert(error));
  };

  const downloadExcel = () => {
    // Create a copy of the data with the totalPaid calculated
    const updatedData = data.map((item) => {
      const totalPaid =
        parseFloat(item.advance) +
        item.customArray
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

      // Create a new object excluding 'advance' and including 'totalPaid'
      const { advance, ...rest } = item;
      return { ...rest, totalPaid: totalPaid.toFixed(2) };
    });
    const payload = {
      data: updatedData,
      statistics: {
        totalPaid,
        totalPaidTransactions,
        totalDueToday,
        totalDueTodayTransactions,
        totalOverdue,
        totalOverdueTransactions,
        totalUnpaid,
        totalUnpaidTransactions,
        totalTransactions,
        totalAmountForMonth,
      },
    };

    console.log(payload);
    fetch(
      "https://app.smartco.live/api/upcomingPaymentExcel/upcomingPaymentExcel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the updated data to the backend
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.blob(); // If the response is OK, get the Excel blob
        } else {
          throw new Error("Error converting to Excel");
        }
      })
      .then((blob) => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        let formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;
        link.download = `upcoming payment excel Report - ${formattedDateTime}.xlsx`;
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click
        link.click();
        // Remove the link when done
        document.body.removeChild(link);
      })
      .catch((error) => alert(error));
  };

  const resetTable = () => {
    const fetchData = async () => {
      try {
        // Fetch selling data
        const sellingResponse = await fetch(
          "https://app.smartco.live/selling/getSelling",
          { method: "GET" }
        );
        if (!sellingResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const sellingData = await sellingResponse.json();

        // Fetch inventory data
        const inventoryResponse = await fetch(
          "https://app.smartco.live/inventory/getInventory",
          { method: "GET" }
        );
        if (!inventoryResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const inventoryData = await inventoryResponse.json();

        // Fetch customer data
        const customerResponse = await fetch(
          "https://app.smartco.live/api/customer/",
          { method: "GET" }
        );
        if (!customerResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const customerData = await customerResponse.json();

        // Create a map for customer data by civil_id
        const customerMap = customerData.reduce((map, customer) => {
          map[customer.civil_id] = customer;
          return map;
        }, {});

        // Get the current date
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based (0 = January)
        const currentYear = now.getFullYear();
        const currentDateString = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Helper function to validate date format
        const isValidDate = (dateString) => {
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          return dateString.match(regex) !== null;
        };

        // Filter and process selling data based on customArray dates
        const filteredSellingData = sellingData
          .map((sellingItem) => {
            // Extract current month payments from customArray
            const currentMonthPayments = sellingItem.customArray.filter(
              (payment) => {
                const paymentDate = new Date(payment.date);
                return (
                  paymentDate.getMonth() === currentMonth &&
                  paymentDate.getFullYear() === currentYear
                );
              }
            );

            const currentMonthAmount = currentMonthPayments.reduce(
              (sum, payment) => sum + parseFloat(payment.price),
              0
            );
            const currentMonthDate =
              currentMonthPayments.length > 0
                ? currentMonthPayments[0].date
                : "N/A";

            // Determine the status
            const status = sellingItem.customArray.reduce((status, payment) => {
              const paymentDate = new Date(payment.date);
              const paymentDateString = paymentDate.toISOString().split("T")[0];

              if (payment.status === "paid") {
                return status !== "Overdue" && status !== "Due Today"
                  ? "Paid"
                  : status;
              } else if (
                paymentDateString === currentDateString &&
                status !== "Overdue"
              ) {
                return "Due Today"; // Priority for Due Today
              } else if (payment.status === "unpaid" && paymentDate < now) {
                return "Overdue"; // Priority for Overdue
              } else if (payment.status === "unpaid" && paymentDate >= now) {
                return status !== "Overdue" &&
                  status !== "Due Today" &&
                  status !== "Paid"
                  ? "Unpaid"
                  : status;
              }
              return status; // Maintain the status if already set
            }, "Unknown");

            // Validate date
            if (!isValidDate(currentMonthDate) && currentMonthDate !== "N/A") {
              console.warn(`Invalid date format: ${currentMonthDate}`);
            }

            return {
              ...sellingItem,
              currentMonthAmount: Math.round(currentMonthAmount), // Round to nearest number
              currentMonthDate, // Adding current month date
              status: status || "Unknown", // Ensure status is always a string
            };
          })
          .filter((item) => item.currentMonthAmount > 0); // Only include items with amount for the current month

        // Merge sellingData with inventoryData and customerData
        const mergedData = filteredSellingData.map((sellingItem) => {
          const inventoryItem = inventoryData.find(
            (item) => item.emiNumber === sellingItem.emiNumber
          );
          const customer = customerMap[sellingItem.civilID] || {};

          const totalPaid =
            parseFloat(sellingItem.advance) +
            sellingItem.customArray
              .filter((payment) => payment.status === "paid")
              .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

          let totalPayableBalance = sellingItem.customArray
            .filter((payment) => payment.status === "unpaid")
            .reduce((sum, payment) => sum + parseFloat(payment.price), 0);

          totalPayableBalance = Math.round(totalPayableBalance);

          const purchasePrice = inventoryItem
            ? parseFloat(inventoryItem.price)
            : 0;
          const sellingPrice = parseFloat(sellingItem.price);
          const profit = sellingPrice - purchasePrice;

          return {
            ...sellingItem,
            totalPaid: Math.round(totalPaid), // Round to nearest number
            purchasePrice: Math.round(purchasePrice), // Round to nearest number
            profit: Math.round(profit), // Round to nearest number
            totalPayableBalance, // Already rounded
            customerMobile: customer.mobile || "N/A", // Adding customer mobile number
          };
        });

        setOriginalData(mergedData);
        setData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  };

  const handleFetch = () => {

      const now = new Date();
      const todayDateString = now.toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

      let filteredData = originalData.filter((item) => {
      const itemsalesDate = new Date(item.currentMonthDate); // Convert item date to Date object

      let fromDate = salesDateFrom ? new Date(salesDateFrom) : null;
      let toDate = salesDateTo ? new Date(salesDateTo) : null;

      // Adjust the time of fromDate and toDate to consider the whole day
      if (fromDate) fromDate.setHours(0, 0, 0, 0);
      if (toDate) toDate.setHours(23, 59, 59, 999);


       // Check if "Today Paid" is selected and filter by today's date and payment status being "paid"
    const isTodayPaid =
    statusFilter === "today paid" &&
    item.customArray.some(
      (payment) =>
        new Date(payment.date).toISOString().split("T")[0] === todayDateString &&
        payment.status === "paid"
    );

      return (
        (deviceName === "" || item.deviceName.includes(deviceName)) &&
        (emiNumber === "" || item.emiNumber.includes(emiNumber)) &&
        (customerName === "" || item.customerName.includes(customerName)) &&
        (civilID === "" || item.civilID.includes(civilID)) &&
        (price === "" || item.price.includes(price)) &&
        (months === "" || item.months.includes(months)) &&
        (advance === "" || item.advance.includes(advance)) &&
        (balance === "" || item.balance.includes(balance)) &&
        (!fromDate || itemsalesDate >= fromDate) &&
        (!toDate || itemsalesDate <= toDate) &&
        (statusFilter === "" || item.status === statusFilter || isTodayPaid)
      );
    });

    setData(filteredData);

    // Clear all fields after fetch
    setDeviceName("");
    setemiNumber("");
    setcustomerName("");
    setcivilID("");
    setprice("");
    setmonths("");
    setadvance("");
    setbalance("");
    setsalesDateFrom(null); // Set to null to clear the date picker
    setsalesDateTo(null); // Set to null to clear the date picker
    setStatusFilter(""); // Clear status filter
  };

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "5px 10px",
      borderRadius: "12px",
      color: "white",
      display: "inline-block", // Ensure the background only covers the text
      textAlign: "center",
      fontWeight: "bold",
      marginTop: "10px",
    };

    switch (status) {
      case "Paid":
        return { ...baseStyle, backgroundColor: "green" };
      case "Unpaid":
        return { ...baseStyle, backgroundColor: "blue" };
      case "Overdue":
      case "Due Today":
        return { ...baseStyle, backgroundColor: "red" };
      default:
        return baseStyle;
    }
  };

  return (
    <div>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            sx={{ backgroundColor: "white", color: "#637381" }}
            position="absolute"
            open={open}
          >
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                noWrap
                sx={{
                  flexGrow: 1,
                  background: "linear-gradient(90deg, #C63DE7, #752888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Public Sans, sans-serif",
                  fontWeight: "bold",
                }}
              >
                SMARTCO
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 4,
                  padding: 3,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  boxShadow: 3,
                  maxWidth: 1000, // Adjust the maxWidth as needed
                  width: "100%",
                  mx: "auto", // Center the box
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontFamily: "Public Sans, sans-serif",
                    fontWeight: "bold",
                    color: "#637381",
                  }}
                >
                  upcoming payment
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Device Name"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="emiNumber"
                        value={emiNumber}
                        onChange={(e) => setemiNumber(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="customerName"
                        value={customerName}
                        onChange={(e) => setcustomerName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="civilID"
                        value={civilID}
                        onChange={(e) => setcivilID(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="price"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="months"
                        value={months}
                        onChange={(e) => setmonths(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} style={{ marginTop: "16px" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          fullWidth
                          label="sales Date From"
                          value={salesDateFrom}
                          onChange={(date) => setsalesDateFrom(date)}
                          style={{ marginTop: "20px" }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ marginTop: "16px" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          fullWidth
                          label="sales Date To"
                          value={salesDateTo}
                          onChange={(date) => setsalesDateTo(date)}
                          style={{ marginTop: "20px" }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ marginTop: "16px" }}>
                      <FormControl fullWidth>
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                          labelId="status-filter-label"
                          value={statusFilter}
                          label="Status"
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                          <MenuItem value="Unpaid">Unpaid</MenuItem>
                          <MenuItem value="Overdue">Overdue</MenuItem>
                          <MenuItem value="Due Today">Due Today</MenuItem>
                          <MenuItem value="today paid">Today Paid</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={3}>
                      <Button
                        onClick={handleFetch}
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#752888",
                          "&:hover": {
                            backgroundColor: "#C63DE7",
                          },
                          fontFamily: "Public Sans, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Fetch
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        onClick={resetTable}
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#752888",
                          "&:hover": {
                            backgroundColor: "#C63DE7",
                          },
                          fontFamily: "Public Sans, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        onClick={downloadPDF}
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#752888",
                          "&:hover": {
                            backgroundColor: "#C63DE7",
                          },
                          fontFamily: "Public Sans, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Download PDF
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        onClick={downloadExcel}
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#752888",
                          "&:hover": {
                            backgroundColor: "#C63DE7",
                          },
                          fontFamily: "Public Sans, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Download Excel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
                  <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={4}>
                      {/* Total Receivable */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Total Receivable
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalAmountForMonth}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image3}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "100px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Paid */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Paid
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalPaid}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalPaidTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image5}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "100px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Unpaid */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Unpaid
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalUnpaid}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalUnpaidTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image2}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "80px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Due Today */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Due Today
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalDueToday}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalDueTodayTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image1}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "80px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Today paid */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Today Paid
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalPaidToday}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalPaidTodayTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image5}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "80px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>


                      {/* Overdue */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              component="p"
                              gutterBottom
                            >
                              Overdue
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" component="p">
                                KD {totalOverdue}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {totalOverdueTransactions} transactions
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <img
                              src={image2}
                              alt="Chart"
                              style={{
                                height: "auto",
                                width: "80px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </Box>
            </Container>

            <Grid container>
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 4,
                    padding: 3,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: 3,
                    maxWidth: 1500, // Adjust this value as needed
                    flexGrow: 1,
                    mx: "auto",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{ width: "100%", overflowX: "auto" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Device Name
                          </TableCell>

                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Emi Number
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            CivilID
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            CustomerName
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Phone
                          </TableCell>

                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Months
                          </TableCell>

                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Selling Price
                          </TableCell>

                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Total Payable
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Amount
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#752888",
                              color: "white",
                            }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.length > 0 &&
                          data.map((item, index) => (
                            <TableRow
                              key={index}
                              onClick={() => handleRowClick(item)}
                            >
                              <TableCell>{item.deviceName}</TableCell>
                              <TableCell>{item.emiNumber}</TableCell>
                              <TableCell>{item.civilID}</TableCell>
                              <TableCell>{item.customerName}</TableCell>
                              <TableCell>{item.customerMobile}</TableCell>
                              <TableCell>{item.months}</TableCell>
                              <TableCell>{item.price}</TableCell>
                              <TableCell>{item.totalPayableBalance}</TableCell>
                              <TableCell>{item.currentMonthDate}</TableCell>
                              <TableCell>{item.currentMonthAmount}</TableCell>
                              <TableCell style={getStatusStyle(item.status)}>
                                {item.status}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* Modal */}
                  <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={isModalOpen}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          maxWidth: 400,
                          bgcolor: "white",
                          boxShadow: 24,
                          p: 2,
                          borderRadius: 4,
                          overflowY: "auto", // Enable scroll bar for large data
                        }}
                      >
                        <IconButton
                          aria-label="close"
                          onClick={handleCloseModal}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>

                        <Typography
                          variant="h6"
                          component="h2"
                          id="modal-title"
                        >
                          {selectedRow?.deviceName}
                        </Typography>

                        {/* Display other details from selectedRow */}
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Advance Amount</TableCell>
                                <TableCell>Balance</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{selectedRow?.price}</TableCell>
                                <TableCell>{selectedRow?.advance}</TableCell>
                                <TableCell>{selectedRow?.balance}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Typography
                          variant="h6"
                          component="h2"
                          id="modal-title"
                        >
                          Installment
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedRow?.customArray.map((item) => (
                                <TableRow key={item._id.$oid}>
                                  <TableCell>{item.date}</TableCell>
                                  <TableCell>{item.price}</TableCell>
                                  <TableCell>{item.status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Fade>
                  </Modal>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default EUpcommingPayment;