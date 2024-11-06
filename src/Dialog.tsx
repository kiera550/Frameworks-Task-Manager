import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormHelperText from '@mui/material/FormHelperText';
import { Box } from '@mui/material';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  taskData?: any; 
  title: string;
  existingTitles?: string[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, onSubmit, taskData, title, existingTitles = [] }) => {
  const initialTaskState = {
    title: '',
    desc: '',
    deadline: '',
    priority: 'Low',
    isComplete: false,
  };

  const [task, setTask] = React.useState(taskData || initialTaskState);
  const [errors, setErrors] = React.useState<{ title?: string; desc?: string; deadline?: string }>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({
      ...prev,
      priority: event.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!task.title) newErrors.title = 'Title is required';
    if (existingTitles.includes(task.title) && taskData?.title !== task.title)
      newErrors.title = 'Title must be unique';
    if (!task.desc) newErrors.desc = 'Description is required';
    if (!task.deadline) newErrors.deadline = 'Deadline is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit(task);
    setTask(initialTaskState);
    setErrors({});
    onClose();
  };
  
  React.useEffect(() => {
    if (taskData) {
      setTask(taskData);
    } else {
      setTask(initialTaskState);
    }
  }, [taskData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={task.title}
          onChange={handleInputChange}
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          required
          margin="dense"
          id="desc"
          name="desc"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={task.desc}
          onChange={handleInputChange}
          error={!!errors.desc}
          helperText={errors.desc}
        />
        <TextField
          required
          margin="dense"
          id="deadline"
          name="deadline"
          label="Deadline"
          type="date"
          fullWidth
          variant="standard"
          value={task.deadline}
          onChange={handleInputChange}
          error={!!errors.deadline}
          helperText={errors.deadline}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl>
          <FormLabel id="priority-label">Priority</FormLabel>
          <RadioGroup row aria-labelledby="priority-label" name="priority" value={task.priority} onChange={handlePriorityChange}>
            <FormControlLabel value="Low" control={<Radio />} label="Low" />
            <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="High" control={<Radio />} label="High" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleSubmit}>
          {title === 'Add Task' ? 'Add' : 'Update'}
        </Button>
        <Button variant="contained" color="error" endIcon={<DoNotDisturbAltIcon />} onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AddTaskDialog = (props: Omit<TaskDialogProps, 'title' | 'taskData'>) => (
  <TaskDialog {...props} title="Add Task" />
);

export const UpdateTaskDialog = (props: TaskDialogProps) => (
  <TaskDialog {...props} title="Update Task" />
);
