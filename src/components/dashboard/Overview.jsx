import Notifications from "./overviewComponents/Notifications";
import Recents from "./overviewComponents/Recents";
import Trash from "./overviewComponents/Trash";
import WorkManager from "./overviewComponents/WorkManager";

const Overview = () => {
  return (
    <div
      className="grid gap-4 p-4
    grid-cols-1 
      sm:grid-cols-2
      lg:grid-cols-4
    "
    >
      <Recents />
      <Notifications />
      <Trash />
      <WorkManager />
    </div>
  );
};

export default Overview;
