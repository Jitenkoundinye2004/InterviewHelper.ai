import React, { useEffect, useState, useContext } from "react";
import { LuPlus, LuLayoutDashboard, LuSearch } from "react-icons/lu";
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
      setSession(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();


    } catch (error) {
      console.error("Error deleeting session data:", error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchAllSessions();
    }
  }, [loading, user]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </DashboardLayout>
  );

  if (!user) return <div>Please log in to view dashboard.</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 md:px-8 py-8 min-h-[calc(100vh-80px)]">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Here is an overview of your interview preparation sessions.</p>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus size={18} />
            Create New Session
          </button>
        </div>


        {/* Sessions Grid */}
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || ""}
                questions={data?.questions?.length || 0}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("MMM Do, YYYY")
                    : ""
                }
                onselect={() => navigate(`/interview-prep/${data._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center p-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <LuLayoutDashboard className="text-blue-500 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Sessions Found</h3>
            <p className="text-gray-500 max-w-md mb-8">
              You haven't created any interview sessions yet. Click the button below to start preparing for your dream job!
            </p>
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus size={18} />
              Start Your First Session
            </button>
          </div>
        )}


        {/* Modals */}
        <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Create New Session">
          <CreateSessionForm onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllSessions();
          }} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert?.open}
          onClose={() => {
            setOpenDeleteAlert({ open: false, data: null });
          }}
          title="Delete Alert"
        >
          <div className="w=[30vw]">
            <DeleteAlertContent
              content="Are you sure you want to delete this session details?"
              onDelete={() => {
                deleteSession(openDeleteAlert.data)
              }}
            />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
