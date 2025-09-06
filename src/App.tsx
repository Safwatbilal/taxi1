import { RouterProvider } from "react-router-dom";
import { Tanstack } from "./components/provider/Tanstack";
import routes from "./routes/routes";
import { Toaster } from "sonner";
import { Redux } from "./components/provider/Redux";
import { SocketProvider } from "./components/provider/SocketProvider";

function App() {
  return (
    <Redux>
      <Tanstack>
        <SocketProvider>
          <RouterProvider router={routes} />
          <Toaster
            toastOptions={{
              classNames: {
                success:
                  "bg-green-500 text-white border-green-600 rounded-lg p-4 font-medium shadow-lg",
                error:
                  "bg-red-500 text-white border-red-600 rounded-lg p-4 font-medium shadow-lg",
                info: "bg-blue-500 text-white border-blue-600 rounded-lg p-4 font-medium shadow-lg",
                warning:
                  "bg-yellow-500 text-white border-yellow-600 rounded-lg p-4 font-medium shadow-lg",
              },
            }}
            theme="light"
            position="bottom-right"
            richColors
          />
        </SocketProvider>
      </Tanstack>
    </Redux>
  );
}

export default App;
