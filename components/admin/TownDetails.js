import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    LocationOn as LocationOnIcon,
    Map as MapIcon,
    Save as SaveIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { API_URL } from '../../configuration';
import MapPicker from './MapPicker';

export default function TownDetails() {
    const [town, setTown] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Dialog states
    const [comunidadDialog, setComunidadDialog] = useState({ open: false, comunidad: null, index: null });
    const [barrioDialog, setBarrioDialog] = useState({ open: false, barrio: null, comunidadIndex: null, barrioIndex: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, comunidadIndex: null, barrioIndex: null });

    // Alert states
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        async function fetchFirstTown() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/towns`);
                if (!res.ok) throw new Error('Error fetching towns');
                const data = await res.json();

                // Get the first town
                if (data && data.length > 0) {
                    setTown(data[0]);
                } else {
                    setError('No towns found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFirstTown();
    }, []);

    // Save town changes to API
    const saveTown = async (updatedTown) => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/towns/${updatedTown.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTown),
            });

            if (!res.ok) throw new Error('Error saving town');

            const savedTown = await res.json();
            setTown(savedTown);
            setAlert({ open: true, message: 'Cambios guardados', severity: 'success' });
        } catch (err) {
            setAlert({ open: true, message: `Error guardando cambios: ${err.message}`, severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Comunidad CRUD functions
    const handleAddComunidad = () => {
        setComunidadDialog({
            open: true,
            comunidad: { nombre: '', center: '', barrios: [] },
            index: null
        });
    };

    const handleEditComunidad = (comunidad, index) => {
        setComunidadDialog({
            open: true,
            comunidad: { ...comunidad },
            index
        });
    };

    const handleSaveComunidad = async (comunidadData) => {
        const updatedTown = { ...town };

        if (comunidadDialog.index !== null) {
            // Edit existing comunidad
            updatedTown.comunidades[comunidadDialog.index] = comunidadData;
        } else {
            // Add new comunidad
            if (!updatedTown.comunidades) updatedTown.comunidades = [];
            updatedTown.comunidades.push(comunidadData);
        }

        await saveTown(updatedTown);
        setComunidadDialog({ open: false, comunidad: null, index: null });
    };

    const handleDeleteComunidad = (index) => {
        setDeleteDialog({
            open: true,
            type: 'comunidad',
            comunidadIndex: index,
            barrioIndex: null
        });
    };

    const confirmDeleteComunidad = async () => {
        const updatedTown = { ...town };
        updatedTown.comunidades.splice(deleteDialog.comunidadIndex, 1);
        await saveTown(updatedTown);
        setDeleteDialog({ open: false, type: null, comunidadIndex: null, barrioIndex: null });
    };

    // Barrio CRUD functions
    const handleAddBarrio = (comunidadIndex) => {
        setBarrioDialog({
            open: true,
            barrio: { nombre: '', color: '#000000', center: '' },
            comunidadIndex,
            barrioIndex: null
        });
    };

    const handleEditBarrio = (barrio, comunidadIndex, barrioIndex) => {
        setBarrioDialog({
            open: true,
            barrio: { ...barrio },
            comunidadIndex,
            barrioIndex
        });
    };

    const handleSaveBarrio = async (barrioData) => {
        const updatedTown = { ...town };
        const comunidad = updatedTown.comunidades[barrioDialog.comunidadIndex];

        if (barrioDialog.barrioIndex !== null) {
            // Edit existing barrio
            comunidad.barrios[barrioDialog.barrioIndex] = barrioData;
        } else {
            // Add new barrio
            if (!comunidad.barrios) comunidad.barrios = [];
            comunidad.barrios.push(barrioData);
        }

        await saveTown(updatedTown);
        setBarrioDialog({ open: false, barrio: null, comunidadIndex: null, barrioIndex: null });
    };

    const handleDeleteBarrio = (comunidadIndex, barrioIndex) => {
        setDeleteDialog({
            open: true,
            type: 'barrio',
            comunidadIndex,
            barrioIndex
        });
    };

    const confirmDeleteBarrio = async () => {
        const updatedTown = { ...town };
        updatedTown.comunidades[deleteDialog.comunidadIndex].barrios.splice(deleteDialog.barrioIndex, 1);
        await saveTown(updatedTown);
        setDeleteDialog({ open: false, type: null, comunidadIndex: null, barrioIndex: null });
    };

    if (loading) {
        return <Typography>Cargando detalles del pueblo...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!town) {
        return <Typography>No se encontró información del pueblo</Typography>;
    }

    return (
        <Box>
            {/* Town Header Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {town.nombre}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <MapIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Centro del Mapa</Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                {town.map_center
                                    ? `Latitud: ${town.map_center.lat}, Longitud: ${town.map_center.lng}`
                                    : 'No especificado'
                                }
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Categorías
                            </Typography>
                            {town.categories && town.categories.length > 0 ? (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {town.categories.map((cat, idx) => (
                                        <Chip
                                            key={idx}
                                            label={cat.label}
                                            size="medium"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No hay categorías definidas
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Comunidades Cards */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Comunidades
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddComunidad}
                    disabled={saving}
                >
                    Agregar Comunidad
                </Button>
            </Box>

            {town.comunidades && town.comunidades.length > 0 ? (
                <Grid container spacing={3}>
                    {town.comunidades.map((comunidad, idx) => (
                        <Grid item xs={12} md={6} lg={4} key={idx}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Box display="flex" alignItems="center">
                                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="h6">
                                                {comunidad.nombre}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditComunidad(comunidad, idx)}
                                                disabled={saving}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteComunidad(idx)}
                                                disabled={saving}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Centro:</strong> {comunidad.center || 'No especificado'}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                                        <Typography variant="subtitle1">
                                            Barrios ({comunidad.barrios ? comunidad.barrios.length : 0})
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleAddBarrio(idx)}
                                            disabled={saving}
                                        >
                                            Agregar
                                        </Button>
                                    </Box>

                                    {comunidad.barrios && comunidad.barrios.length > 0 ? (
                                        <List dense>
                                            {comunidad.barrios.map((barrio, barrioIdx) => {
                                                return (
                                                    <ListItem key={barrioIdx} sx={{ px: 0 }}>
                                                        <ListItemText
                                                            primary={
                                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <Typography variant="body2">
                                                                            {barrio.nombre}
                                                                        </Typography>
                                                                        <Chip
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: barrio.color || '#ccc',
                                                                                color: '#fff',
                                                                                fontSize: '0.7rem',
                                                                                height: '20px',
                                                                                '& .MuiChip-label': {
                                                                                    textShadow: '0 0 2px rgba(0,0,0,0.8)'
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Box>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleEditBarrio(barrio, idx, barrioIdx)}
                                                                            disabled={saving}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleDeleteBarrio(idx, barrioIdx)}
                                                                            disabled={saving}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                            secondary={
                                                                barrio.center ? (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Centro: {barrio.center}
                                                                    </Typography>
                                                                ) : null
                                                            }
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No hay barrios asignados
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" align="center">
                            No hay comunidades configuradas para este pueblo
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Snackbar Alert */}
            <Snackbar
                open={alert.open}
                autoHideDuration={2000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            {/* Comunidad Dialog */}
            <ComunidadDialog
                open={comunidadDialog.open}
                comunidad={comunidadDialog.comunidad}
                onClose={() => setComunidadDialog({ open: false, comunidad: null, index: null })}
                onSave={handleSaveComunidad}
                saving={saving}
            />

            {/* Barrio Dialog */}
            <BarrioDialog
                open={barrioDialog.open}
                barrio={barrioDialog.barrio}
                onClose={() => setBarrioDialog({ open: false, barrio: null, comunidadIndex: null, barrioIndex: null })}
                onSave={handleSaveBarrio}
                saving={saving}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, type: null, comunidadIndex: null, barrioIndex: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={2}>
                        <WarningIcon color="warning" />
                        Eliminar {deleteDialog.type === 'comunidad' ? 'Comunidad' : 'Barrio'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas eliminar {deleteDialog.type === 'comunidad' ? 'esta comunidad' : 'este barrio'}? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, type: null, comunidadIndex: null, barrioIndex: null })}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={deleteDialog.type === 'comunidad' ? confirmDeleteComunidad : confirmDeleteBarrio}
                        variant="contained"
                        color="error"
                        disabled={saving}
                        startIcon={<DeleteIcon />}
                    >
                        {saving ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// Comunidad Dialog Component
function ComunidadDialog({ open, comunidad, onClose, onSave, saving }) {
    const [formData, setFormData] = useState({ nombre: '', center: '', barrios: [] });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (comunidad) {
            setFormData(comunidad);
        }
        setErrors({});
    }, [comunidad, open]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }
        if (!formData.center.trim()) {
            newErrors.center = 'El centro es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {comunidad?.nombre ? 'Editar Comunidad' : 'Agregar Nueva Comunidad'}
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        fullWidth
                        disabled={saving}
                    />
                    <Box>
                        <TextField
                            label="Centro (lat,lng)"
                            value={formData.center}
                            onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                            error={!!errors.center}
                            helperText={errors.center || 'Formato: 18.4606607,-70.8405734'}
                            fullWidth
                            disabled={saving}
                        />
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>O selecciona en el mapa:</Typography>
                        <MapPicker
                            center={formData.center}
                            onLocationSelect={(lat, lng) => setFormData({ ...formData, center: `${lat},${lng}` })}
                            height="300px"
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? null : <SaveIcon />}
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Barrio Dialog Component
function BarrioDialog({ open, barrio, onClose, onSave, saving }) {
    const [formData, setFormData] = useState({ nombre: '', color: '#000000', center: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (barrio) {
            setFormData(barrio);
        }
        setErrors({});
    }, [barrio, open]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }
        if (!formData.center.trim()) {
            newErrors.center = 'El centro es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {barrio?.nombre ? 'Editar Barrio' : 'Agregar Nuevo Barrio'}
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        fullWidth
                        disabled={saving}
                    />
                    <Box>
                        <Typography variant="body2" gutterBottom>Color</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                disabled={saving}
                                style={{
                                    width: '50px',
                                    height: '40px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            />
                            <TextField
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                size="small"
                                disabled={saving}
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <TextField
                            label="Centro (lat,lng)"
                            value={formData.center}
                            onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                            error={!!errors.center}
                            helperText={errors.center || 'Formato: 18.4606607,-70.8405734'}
                            fullWidth
                            disabled={saving}
                        />
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>O selecciona en el mapa:</Typography>
                        <MapPicker
                            center={formData.center}
                            onLocationSelect={(lat, lng) => setFormData({ ...formData, center: `${lat},${lng}` })}
                            height="300px"
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? null : <SaveIcon />}
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}