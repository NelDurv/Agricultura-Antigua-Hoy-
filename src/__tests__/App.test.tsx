import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App - navegacion y estructura', () => {
  it('renderiza la barra de navegacion con el boton Inicio', () => {
    render(<App />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('renderiza el footer con el nombre del proyecto', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('Agricultura Antigua');
  });

  it('renderiza la seccion de inicio por defecto', () => {
    render(<App />);
    expect(screen.getByText('Preservamos saberes de la tierra, respaldados por la ciencia moderna.')).toBeInTheDocument();
  });
});

describe('App - funcionalidad de tabs', () => {
  it('tiene 9 tabs de navegacion', () => {
    render(<App />);
    const tabNames = ['Inicio', 'Campus', 'Biblioteca', 'Academia', 'Comunidad', 'AI-Ready', 'Herramientas', 'Perfil'];
    tabNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('carga el logo con el nombre de la aplicacion', () => {
    render(<App />);
    const logo = screen.getByText('Saberes Milenarios para Hoy');
    expect(logo).toBeInTheDocument();
  });
});
