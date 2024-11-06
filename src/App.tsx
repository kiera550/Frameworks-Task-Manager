import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  MenuIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DeleteIcon,
  AddCircleIcon,
  DriveFileRenameOutlineIcon,
  AddTaskDialog,
  UpdateTaskDialog,
} from './Imports';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  id: number;
  title: string;
  desc: string;
  deadline: string;
  priority: string;
  isComplete: boolean;
}

function App() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [rows, setRows] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setCurrentTaskId(null);
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const newId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    const taskWithId = { id: newId, ...newTask, isComplete: false };
    setRows((prev) => [...prev, taskWithId]);
    toast.success('Task successfully added!');
    handleClose();
  };

  const handleEditTask = (id: number) => {
    const taskToEdit = rows.find((row) => row.id === id);
    if (taskToEdit) {
      setCurrentTaskId(id);
      setUpdateOpen(true);
    }
  };

  const handleUpdateTask = (updatedTask: Omit<Task, 'id'>) => {
    if (currentTaskId !== null) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === currentTaskId ? { ...row, ...updatedTask } : row
        )
      );
      toast.success('Task successfully updated!');
    }
    handleUpdateClose();
  };

  const handleCompleteTask = (id: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, isComplete: !row.isComplete } : row
      )
    );
    toast.success('Task marked as complete!');
  };

  const handleDeleteTask = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    toast.success('Task successfully deleted!');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FRAMEWORKS
            </Typography>
            <Button
              id="add"
              color="inherit"
              size="small"
              variant="outlined"
              endIcon={<AddCircleIcon />}
              onClick={handleClickOpen}
            >
              Add
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <AddTaskDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleAddTask}
        existingTitles={rows.map((task) => task.title)}
      />

      {currentTaskId !== null && (
        <UpdateTaskDialog
          open={updateOpen}
          onClose={handleUpdateClose}
          onSubmit={handleUpdateTask}
          taskData={rows.find((row) => row.id === currentTaskId)}
          existingTitles={rows.map((task) => task.title)}
        />
      )}

      <Paper sx={{ padding: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Is Complete?</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell>{row.deadline}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={row.isComplete}
                      onChange={() => handleCompleteTask(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {!row.isComplete && (
                      <Button
                        variant="contained"
                        endIcon={<DriveFileRenameOutlineIcon />}
                        onClick={() => handleEditTask(row.id)}
                      >
                        Update
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<DeleteIcon />}
                      onClick={() => handleDeleteTask(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
