import React, { useEffect, useState, useContext } from "react";
import { LuSparkles, LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import moment from "moment";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, loading } = useContext(UserContext);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSession] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log(response.data); // log response
      setSession(response.data);  // save sessions
      
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open:false,
        data:null,
      });
      fetchAllSessions();

      
    } catch (error) {
      console.error("Error deleeting session data:",error);
    }
  };

  const handleCreateSession = async () => {
    // implement create session logic here
  };

  useEffect(() => {
    if (!loading && user) {
      fetchAllSessions();
    }
  }, [loading, user]);

  if (loading) return <div>Loading user data...</div>;
  if (!user) return <div>Please log in to view dashboard.</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-4">
   
          {sessions?.map((data, index) => (
  <SummaryCard
    key={data?._id}
    colors={CARD_BG[index % CARD_BG.length]}
    role={data?.role || ""}
    topicsToFocus={data?.topicsToFocus || ""}
    experience={data?.experience || ""}
    questions={data?.questions?.length || ""}
    description={data?.description || ""}
    lastUpdated={
      data?.updatedAt
        ? moment(data.updatedAt).format("Do MMM YYYY")
        : ""
    }
    onselect={() => navigate(`/InterviewPrep/${data._id}`)}
    onDelete={() => setOpenDeleteAlert({ open: true, data })}
  />
))}

          {/* Your content here */}
        </div>

        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#3B82F6] to-[#1E40AF] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:text-white transition-colors cursor-pointer hover:shadow-blue-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>

        <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Create New Session">
          <CreateSessionForm onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllSessions();
          }} />
        </Modal>
      </div>
      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={()=>{
          setOpenDeleteAlert({open:false , data:null});

        }}
        title="Delete Alert"
        >
          <div className="w=[30vw]">
            <DeleteAlertContent
            content = "Are you sure yo want to delete this session details?"
            onDelete={()=>{
              deleteSession(openDeleteAlert.data)
            }} 
            />
          </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;









