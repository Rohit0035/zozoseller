import React from "react";
import { useSelector } from "react-redux";

const LoaderOverlay = () => {
  const loading = useSelector(state => state.loader.loader); // Get loading state from Redux

  if (!loading) return null; // Hide if not loading

  return (
    <div style={styles.loaderOverlay}>
      <div className="spinner-border" style={styles.spinner} role="status">
        {/* <span className="sr-only">Loading...</span> */}
      </div>
    </div>
  );
};

// Styles for loader
const styles = {
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  spinner: {
    width: "4rem",
    height: "4rem",
    color: "#FB8500"
  }
};

export default LoaderOverlay;
