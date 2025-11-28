"use client"

import Link from "next/link";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import SearchInput from "@/features/geo/components/SearchInput";
import { FormInput, ErrorMessage, Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

export default function RegisterForm() {
  const {
    formData,
    handleUserChange,
    handlePasswordChange,
    selectedAddress,
    handleLocationSelect,
    handleSubmit,
    isLoading,
    error,
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ErrorMessage message={error} />

      <div className="flex items-center justify-center space-x-2">
        <FormInput
          label="Nome"
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleUserChange}
          placeholder="Mario"
          required
          maxLength={50}
          disabled={isLoading}
        />

        <FormInput
          label="Cognome"
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleUserChange}
          placeholder="Rossi"
          required
          maxLength={50}
          disabled={isLoading}
        />
      </div>

      <FormInput
        label="Email"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleUserChange}
        placeholder="esempio@email.com"
        required
        maxLength={100}
        minLength={8}
        disabled={isLoading}
      />

      {/* Campo indirizzo con geocoding integrato */}
      <SearchInput
        label="Indirizzo preferito (opzionale)"
        placeholder="Cerca via, città, regione..."
        applyFilter={false}
        onSelect={handleLocationSelect}
        selectedAddress={selectedAddress}
        showCoordinates={false}
        showType={false}
        feedbackMessage={
          <>
            <FontAwesomeIcon icon={faMapPin} className="mr-1" />
            Indirizzo selezionato
          </>
        }
      />

      <FormInput
        label="Password"
        id="password"
        type="password"
        value={formData.password}
        onChange={handlePasswordChange}
        placeholder="••••••••"
        minLength={8}
        required
        disabled={isLoading}
      />

      <FormInput
        label="Conferma password"
        id="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handlePasswordChange}
        placeholder="••••••••"
        minLength={8}
        required
        disabled={isLoading}
      />

      <Button type="submit" disabled={isLoading} className="w-full" >
        {isLoading ? "Registrazione in corso..." : "Registrati"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Hai già un account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Accedi
        </Link>
      </p>
    </form>
  );
}
